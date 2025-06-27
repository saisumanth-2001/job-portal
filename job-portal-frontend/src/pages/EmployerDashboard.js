import React, { useEffect, useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;



const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'FT',
    is_remote: false,
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs/?posted_by_me=true`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      const res = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create job');
      }
      const newJob = await res.json();
      setJobs(prev => [newJob, ...prev]);
      setSuccessMessage('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: 'FT',
        is_remote: false,
        description: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading your jobs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h2>Your Posted Jobs</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>Title:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Company:</label><br />
          <input type="text" name="company" value={formData.company} onChange={handleChange} required />
        </div>
        <div>
          <label>Location:</label><br />
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Job Type:</label><br />
          <select name="job_type" value={formData.job_type} onChange={handleChange}>
            <option value="FT">Full-Time</option>
            <option value="PT">Part-Time</option>
            <option value="CT">Contract</option>
            <option value="IN">Internship</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="is_remote"
              checked={formData.is_remote}
              onChange={handleChange}
            /> Remote
          </label>
        </div>
        <div>
          <label>Description:</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Post Job</button>
      </form>

      <h3>Existing Jobs</h3>
      {jobs.length === 0 && <p>No jobs posted yet.</p>}
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <strong>{job.title}</strong> at {job.company} - {job.location} ({job.job_type}) {job.is_remote ? '[Remote]' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerDashboard;
