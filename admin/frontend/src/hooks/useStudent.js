import { useState } from "react";

export const useStudents = () => {
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]); // Initialize students as an empty array

  const fetchStudents = async () => {
    setError(null);

    try {
      const response = await fetch('/api/admin/students', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });

      const json = await response.json();

      if (response.ok) {
        setStudents(json); // Assuming the response contains the student list
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError("An error occurred while fetching students.");
    }
  };

  return { students, error, fetchStudents };
};
