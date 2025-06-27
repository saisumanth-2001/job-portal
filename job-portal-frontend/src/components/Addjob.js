import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


const AddJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('FT');  // default to FT
  const [description, setDescription] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in');
      return;
    }

    const jobData = { title, company, location, job_type: jobType, description, is_remote: isRemote };

    try {
      const res = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || Object.values(errData).flat().join(', '));
      }

      navigate('/my-jobs');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Add New Job</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        {/* Company */}
        <div className="mb-3">
          <label className="form-label">Company</label>
          <input className="form-control" value={company} onChange={e => setCompany(e.target.value)} required />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input className="form-control" value={location} onChange={e => setLocation(e.target.value)} required />
        </div>

        {/* Job Type */}
        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <select className="form-select" value={jobType} onChange={e => setJobType(e.target.value)} required>
            <option value="FT">Full-Time</option>
            <option value="PT">Part-Time</option>
            <option value="CT">Contract</option>
            <option value="IN">Internship</option>
          </select>
        </div>

        {/* Is Remote */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isRemote"
            checked={isRemote}
            onChange={e => setIsRemote(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isRemote">Is Remote</label>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="5" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary">Add Job</button>
      </form>
    </div>
  );
};

export default AddJob;
