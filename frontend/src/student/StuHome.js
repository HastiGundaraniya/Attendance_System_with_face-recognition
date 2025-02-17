import React, { useState } from 'react'
import { useLogout } from '../hooks/useLogut';
import { useAuthContext } from '../hooks/useAuthContext';

function StuHome() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [subject,setSubject] = useState('')
  const today = new Date().toISOString().split('T')[0];
  const [date,setDate] = useState(today)
  const [status,setStatus] = useState('')
  const [error, setError] = useState('')
  const studentId = user._id

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    console.log(studentId)
    try {
      const response = await fetch('/api/attendance/studata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, subject , studentId})
      });

      if(!response.ok){
        setError("No data found")
      }
      const json = await response.json();
      console.log(json)
      setStatus(json.status)
    }
    catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  const handleCLick = (e) => {
    logout()
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      <h2>hello {user.name}</h2>
      <br />
      <form onSubmit={handleSubmit}>
      <label>Select Subject:</label>
        <select onChange={(e) => setSubject(e.target.value)} value={subject}>
          <option value="">--select--</option>
          <option value="AI">AI</option>
          <option value="ML">ML</option>
          <option value="SE">SE</option>
        </select>
        <br />
        <label>Select date: </label>
        <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} /><br />
        <button>Search</button>
      </form>
      <h5>Status: {status ? <div>{status}</div> : <div>No Data</div>}</h5>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <button onClick={handleCLick}>Log Out</button>
    </div>
  
  )
}

export default StuHome
