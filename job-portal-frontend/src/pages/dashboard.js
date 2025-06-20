import React from 'react';

const Dashboard = () => {
  const trendingJobs = [
    "Remote Software Developer Roles",
    "High Demand: Data Scientists",
    "Top Skills: React and Django",
    "Internships in AI and Machine Learning",
  ];

  const images = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Welcome to Your Job Dashboard</h2>

      <div className="row mb-4">
        {images.map((url, i) => (
          <div key={i} className="col-md-4 mb-3">
            <img src={url} alt={`Job related ${i}`} className="img-fluid rounded shadow-sm" />
          </div>
        ))}
      </div>

      <h3 className="mb-3">Trending Jobs & Topics</h3>
      <div className="list-group mb-4">
        {trendingJobs.map((topic, i) => (
          <div key={i} className="list-group-item list-group-item-action">
            {topic}
          </div>
        ))}
      </div>

      <div className="alert alert-info text-center" role="alert">
        <strong>Ready to kickstart your career?</strong> Start applying today — <a href="/jobs" className="alert-link">find your dream job here!</a>
      </div>
    </div>
  );
};

export default Dashboard;
