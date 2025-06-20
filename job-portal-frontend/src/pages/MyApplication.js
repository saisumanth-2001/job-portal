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

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven’t applied for any jobs yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={tdStyle}>{app.job.title}</td>
                <td style={tdStyle}>{app.job.company}</td>
                <td style={tdStyle}>{getStatusDisplay(app.status)}</td>
                <td style={tdStyle}>{new Date(app.applied_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  borderBottom: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee',
};

const getStatusDisplay = (status) => {
  switch (status) {
    case 'P':
      return 'Pending';
    case 'S':
      return 'Shortlisted';
    case 'R':
      return 'Rejected';
    default:
      return status;
  }
};

export default MyApplications;
