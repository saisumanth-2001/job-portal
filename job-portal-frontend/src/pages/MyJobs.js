import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/jobs/?posted_by_me=true', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?.role === 'EMP' && user.is_verified) {
      fetchMyJobs();
    } else if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleAddJob = () => navigate('/jobs/create');
  const handleEdit = (id) => navigate(`/jobs/edit/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete job');
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewApplicants = (id) => {
    navigate(`/jobs/${id}/applicants`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!user) return <p>Please log in to view this page.</p>;

  if (user.role === 'EMP' && !user.is_verified) {
    return (
      <div className="container">
        <h2>My Jobs</h2>
        <p className="text-warning">
          Your employer account is under review. You cannot post or view jobs until verified by the administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Jobs</h2>

      <button className="btn btn-primary mb-3" onClick={handleAddJob}>
        Add New Job
      </button>

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <div className="list-group">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{job.title}</h5>
                <p>{job.company} - {job.location}</p>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleEdit(job.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => handleViewApplicants(job.id)}
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
