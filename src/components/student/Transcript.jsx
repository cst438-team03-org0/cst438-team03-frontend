import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';


const Transcript = () => {

  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {

    // allows user to filter by term
    const {year, semester} = term || {};
    const params = new URLSearchParams();
    
    if (year) {
      params.append('year', year);
    }

    if (semester) {
      params.append('semester', semester);
    }
    
    const query = params.toString();

    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data);

        // this clears error message after succesful fetch
        setMessage('');
      } 
      else {
        const body = await response.json();
        setMessage(body);
      }
    } 
    catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <>
      <h3>Transcript</h3>
      <Messages response = {message}/>

      <SelectTerm buttonTest = "Filter by Term" onClick = {fetchData}/>
      
      {/*Prevents fetching error if no term entered for filtering*/}
      <button onClick = {() => fetchData()}>Show ALL Terms</button>

      <table className = "Center">
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key = {idx}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr key = {c.enrollmentId}>
              <td>{c.year}</td>
              <td>{c.semester}</td>
              <td>{c.courseId}</td>
              <td>{c.sectionId}</td>
              <td>{c.title}</td>
              <td>{c.credits}</td>
              <td>{c.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  );
}

export default Transcript;