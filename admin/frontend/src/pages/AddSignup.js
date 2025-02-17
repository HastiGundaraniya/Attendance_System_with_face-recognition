import { useState } from "react"
import { useNavigate } from 'react-router-dom';

function AddSignup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authLevel, setAuthLevel] = useState('')    
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    
    const attendance = async (e) => {
      e.preventDefault();
      navigate('/addAttendance')
      
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !authLevel) {
            setError("All fields must be filled");
            return;
        }

        try {
            const response = await fetch('/api/admin/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, authLevel }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Signup failed');
            }

            setError(null);
            setName('');
            setEmail('');
            setPassword('');
            setAuthLevel('');

            console.log("user added", json);
        } catch (error) {
            setError(error.message);
        }
    }

  return (
    <div>
      <button onClick={attendance}>Add student present</button>
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Add Sign Up</h3>
      
      <label>Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name} 
      /><br />
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      /><br />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      /><br />
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

      <button>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
    </div>
  )
}

export default AddSignup
