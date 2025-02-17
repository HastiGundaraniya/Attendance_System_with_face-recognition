import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [authLevel, setAuthLevel] = useState('');
  const {login, error, isLoading} = useLogin()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    if (!email || !password || !authLevel) {
      setFormError('All fields are required');
      return;
    }
    
    setFormError('');

    await login(email, password, authLevel)

    const response = await login(email, password, authLevel)
    console.log(response)
    
    if (authLevel === "professor") {
      navigate('/professor')
    }
    if (authLevel === "student") {
      navigate('/student')
    }
  }; 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />

        <label htmlFor="authLevel">Auth Level</label>
        <select
          id="authLevel"
          name="authLevel"
          onChange={(e) => setAuthLevel(e.target.value)}
          value={authLevel}
        >
          <option value="">Select an option</option>
          <option value="professor">Professor</option>
          <option value="student">Student</option>
        </select>
        <br />

        <button type="submit" disabled={isLoading}>Login</button>
      </form>

      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>} 
    </div>
  );
}

export default LoginForm;
