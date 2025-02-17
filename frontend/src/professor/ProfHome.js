import { useState } from 'react';
import { useLogout } from '../hooks/useLogut';
import { useAuthContext } from '../hooks/useAuthContext';

function ProfHome() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const handleLogout = (e) => {
    logout()
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/attendance/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, subject })
      });

      if (!response.ok) {
        setError("failed to fetch data")
      }

      const json = await response.json();
      console.log(json)
      setStudents(json.students || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setStudents([]);
    }
  }

  return (
    <div>
      <h1>Professor Dashboard</h1>
      <h2>hello prof. {user.name}</h2>
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
        <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
        <button>Search</button>
      </form>
      <br />
      {students.length > 0 ? (
        <div>
          <h3>Attendance Records</h3>
          <ul>
            {students.map((student, index) => (
              <li key={index}>
                ID: {student.studentId}, Status: {student.status}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No attendance records found.</p>
      )}
      {error && <p>{error}</p>}
      <br />
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default ProfHome
