import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }

        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!resumeFile) {
      setApplyMessage('Please upload your resume before applying.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('cover_letter', coverLetter);

    try {
      const response = await fetch(`${API_URL}/jobs/${id}/apply/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          // Note: DO NOT set 'Content-Type' when sending FormData — browser sets it automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to apply for job');
      }

      setApplyMessage('Application submitted successfully!');
      setCoverLetter('');
      setResumeFile(null);
    } catch (err) {
      setApplyMessage(err.message);
    }
  };

  if (loading) return <p>Loading job...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!job) return <p>No job found.</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements}</p>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Upload Resume (required):<br />
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Cover Letter (optional):<br />
          <textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter here..."
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <button onClick={handleApply} style={{ marginTop: '1rem' }}>
        Apply
      </button>

      {applyMessage && (
        <p style={{ color: applyMessage.includes('successfully') ? 'green' : 'red', marginTop: '1rem' }}>
          {applyMessage}
        </p>
      )}
    </div>
  );
};

export default JobDetails;
