import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/applicants/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch applicants');
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/applications/${applicationId}/update-status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedApp = await res.json();
      setApplicants((prev) =>
        prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'P':
        return <span className="badge bg-secondary">Pending</span>;
      case 'S':
        return <span className="badge bg-success">Shortlisted</span>;
      case 'R':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning">Unknown</span>;
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>Applicants for Job ID: {jobId}</h2>
      {applicants.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        applicants.map((app) => (
          <div key={app.id} className="card mb-3 p-3">
            <h5>Applicant: {app.applicant}</h5>
            <p>Status: {getStatusBadge(app.status)}</p>
            {app.cover_letter && (
              <p><strong>Cover Letter:</strong> {app.cover_letter}</p>
            )}
            {app.resume && (
              <a
                href={`http://localhost:8000${app.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-success me-2"
              >
                View Resume
              </a>
            )}
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => updateStatus(app.id, 'S')}
              >
                Shortlist
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => updateStatus(app.id, 'R')}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplicants;
