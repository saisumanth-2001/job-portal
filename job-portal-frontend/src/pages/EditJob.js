import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/jobs/${id}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch job');
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [id, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(job)
      });
      if (!res.ok) throw new Error('Update failed');
      navigate('/my-jobs');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Job</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input name="title" value={job.title} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>Company</label>
          <input name="company" value={job.company} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>Location</label>
          <input name="location" value={job.location} onChange={handleChange} required className="form-control" />
        </div>
        <div className="mb-3">
          <label>Job Type</label>
          <select name="job_type" value={job.job_type} onChange={handleChange} className="form-select">
            <option value="FT">Full Time</option>
            <option value="PT">Part Time</option>
            <option value="CT">Contract</option>
            <option value="IN">Internship</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={job.description} onChange={handleChange} required className="form-control" rows="5" />
        </div>
        <button type="submit" className="btn btn-success">Update Job</button>
      </form>
    </div>
  );
};

export default EditJob;
