import React, { useEffect, useState } from 'react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/my-applications/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        });

        if (!response.ok) throw new Error('Failed to fetch applications');

        const data = await response.json();
        setApplications(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  if (loading) return <p>Loading your applications...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven’t applied for any jobs yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applied At</th>
                <th>Resume</th>
                <th>Cover Letter</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.job?.title || '—'}</td>
                  <td>{app.job?.company || '—'}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>{new Date(app.applied_at).toLocaleString()}</td>
                  <td>
                    {app.resume ? (
                      <a
                        href={`http://localhost:8000${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
                    ) : '—'}
                  </td>
                  <td>{app.cover_letter || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
