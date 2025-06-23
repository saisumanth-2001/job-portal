import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CAN', 
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('User registered successfully!');
        setFormData({ username: '', email: '', password: '', role: 'CAN' });
      } else {
        const data = await response.json();
        setMessage(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} placeholder="Username" onChange={handleChange} required />
        <br />
        <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
        <br />
        <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required />
        <br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="CAN">Candidate</option>
          <option value="EMP">Employer</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Register;
