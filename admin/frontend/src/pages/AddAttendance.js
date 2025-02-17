import React, { useEffect } from 'react';
import { useState } from 'react';
import { useStudents } from '../hooks/useStudent';

function AddAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('');
  const { students, error, fetchStudents } = useStudents();

  useEffect(() => {
    fetchStudents(); // Fetch students when the component mounts
  }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create an array of students with their respective statuses
    const attendanceData = students.map(student => ({
      studentId: student._id,
      status: status 
    }));
  
    const data = {
      date,
      subject,
      students: attendanceData
    };
  
    try {
      const response = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        setMessage('Attendance submitted successfully!');
        setDate('')
        setSubject('')
      } else {
        setMessage('Failed to submit attendance.');
      }
    } catch (err) {
      setMessage('Error submitting attendance: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add Attendance</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
        <br />

        <label>Subject:</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">--Select Subject--</option>
          <option value="AI">AI</option>
          <option value="ML">ML</option>
          <option value="SE">SE</option>
        </select>
        <br />

        {/* Display student list */}
        <h3>Student List</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {students.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>set status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student._id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td><select onChange={(e) => setStatus(e.target.value)}>
                        <option value="">--select--</option>
                        <option value="present">present</option>
                        <option value="absent">absent</option>
                      </select></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found.</p>
        )}
        <br/>
        <button type="submit">Submit Attendance</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddAttendance;
