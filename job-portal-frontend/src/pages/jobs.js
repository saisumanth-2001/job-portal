import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/jobs/');
    if (!response.ok) throw new Error('Failed to fetch jobs');
    const data = await response.json();
    setJobs(data.results);  
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-4">Available Jobs</h2>
      <div className="row">
        {jobs.length === 0 && <p>No jobs found.</p>}
        {jobs.map(job => (
          <div key={job.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                <p className="card-text flex-grow-1">{job.description.substring(0, 100)}...</p>
                <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.job_type}</p>
                <Link to={`/jobs/${job.id}`} className="btn btn-primary mt-auto align-self-start">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
