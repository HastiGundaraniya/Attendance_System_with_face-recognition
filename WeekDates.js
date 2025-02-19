import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const WeekDates = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [weekDates, setWeekDates] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");

  // Function to get all 7 dates of a given week
  const getDatesOfWeek = (year, month, weekNumber) => {
    // Start with the first day of the month
    let startDate = new Date(year, month - 1, 1);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let startDay = startDate.getDay();

    // Adjust to make the first day of the week Monday (since 0 is Sunday)
    if (startDay === 0) startDay = 7;

    // Calculate the number of days to add to get the first Monday of the month
    let daysToFirstMonday = 1 - startDay;

    // Calculate the start date of the requested week
    let firstMonday = new Date(year, month - 1, 1 + daysToFirstMonday + (weekNumber - 1) * 7);
    
    // Get the actual dates of the week
    let weekDates = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!year || !month || !weekNumber || !subject) {
      setError("All fields are required");
      return;
    }

    const dates = getDatesOfWeek(parseInt(year), parseInt(month), parseInt(weekNumber));
    setWeekDates(dates);

    try {
      const response = await fetch("/api/attendance/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates, subject }),
      });

      if (!response.ok) {
        setError("No data found");
        setAttendanceData([]);
        return;
      }

      const json = await response.json();

      // Process data to ensure all days are covered
      const formattedData = dates.map((date) => {
        const record = json.find((item) => item.date === date);
        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), // Feb 15
          present: record ? record.present : 0,
          absent: record ? record.absent : 0,
        };
      });

      setAttendanceData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Error fetching data");
    }
  };

  return (
    <div>
      <h2>Weekly Attendance Chart</h2>
      <form onSubmit={handleSubmit}>
        <select value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">--Select Year--</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)} required>
          <option value="">--Select Month--</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} required>
          <option value="">--Select Week--</option>
          {[...Array(5)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
          <option value="">--Select Subject--</option>
          <option value="AI">AI</option>
          <option value="ML">ML</option>
          <option value="SE">SE</option>
        </select>

        <button type="submit">Get Attendance</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <br/>
      {attendanceData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#4CAF50" name="Present Students" />
            <Bar dataKey="absent" fill="#FF5733" name="Absent Students" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeekDates;
