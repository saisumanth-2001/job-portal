import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [isRemote, setIsRemote] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      if (search) query.append('search', search);
      if (location) query.append('location', location);
      if (jobType) query.append('job_type', jobType);
      if (isRemote) query.append('is_remote', isRemote);

      const response = await fetch(`${API_URL}/jobs/?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container">
      <h2 className="mb-4">Available Jobs</h2>

      <form className="row mb-4" onSubmit={handleFilter}>
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Search by title or company"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={isRemote} onChange={(e) => setIsRemote(e.target.value)}>
            <option value="">Remote/Onsite</option>
            <option value="true">Remote</option>
            <option value="false">Onsite</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Filter</button>
        </div>
      </form>

      <div className="row">
        {loading && <p>Loading jobs...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && jobs.length === 0 && <p>No jobs found.</p>}
        {jobs.map(job => (
          <div key={job.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                <p className="card-text flex-grow-1">
                  {job.description?.substring(0, 100)}...
                </p>
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
