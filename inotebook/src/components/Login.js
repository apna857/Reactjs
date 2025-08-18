import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

export default function Login({ showAlert }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem('token', json.authtoken);
      navigate('/');
       showAlert("Valid credentials", "success");
    } else {
      showAlert("Invalid credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="mb-4">
        <i><h4>Login Page</h4></i>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email1" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email1"
            name="email"
            value={credentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password1" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password1"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mx-2">Submit</button>
        <button type="button" className="btn btn-secondary mx-2">Cancel</button>
      </form>
    </>
  );
}
