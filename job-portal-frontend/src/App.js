import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import Jobs from './pages/jobs';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import JobDetails from './pages/jobDetails';
import MyApplications from './pages/MyApplication';


function App() {
  return (
    <Router>
      
        <Navbar/>
      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/applications" element={<MyApplications />} />
  <Route path="/dashboard" element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } />
  <Route path="/jobs" element={
    <PrivateRoute>
      <Jobs />
    </PrivateRoute>
  } />
  <Route
  path="/jobs/:id"
  element={
    <PrivateRoute>
      <JobDetails />
    </PrivateRoute>
  }
/>
    </Routes>
      </div>
    </Router>
  );
}

export default App;
