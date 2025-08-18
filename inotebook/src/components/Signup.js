import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({showAlert}) => {
  const [credentials, setCredentials] = useState({ name: "", email: '', password: '', cpassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, cpassword } = credentials;

    if (password !== cpassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      // Save the auth token and redirect
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
      <div className='mb-4'>
       <i> <h4>Create a Account</h4></i>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">User Name</label>
            <input type="text" className="form-control" name="name" id="name" onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="email1" className="form-label">Email address</label>
            <input type="email" className="form-control" name="email" id="email1" onChange={onChange} aria-describedby="emailHelp" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name="password" id="password" onChange={onChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name="cpassword" id="cpassword" onChange={onChange} />
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Signup;
