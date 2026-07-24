import { useState } from 'react';
import { Link } from "react-router-dom";
import { REGISTRAR_URL, GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const InstructorSectionsView = () => {
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const headers = ['secNo', 'course id', 'sec id', 'building', 'room', 'times', 'Actions'];

  const fetchSections = async ({ year, semester }) => {
    if(!year || !semester) {
      setMessage('Please select a year and semester');
      return;
    }
    try {
      const response = await fetch(
        `${GRADEBOOK_URL}/sections?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
          'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setMessage('');
      } else {
        const text = await response.text();
        setMessage(text || `Request failed with status ${response.status}`);
      }
    } catch (err) {
      setMessage(err.toString());
    }
  };


  return (
   
      <div className="Center">

      <h2> Instructor Sections</h2>
      <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">Select Semester</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Fall">Fall</option>
      </select>
      <button onClick={() => fetchSections({ year, semester })}>Fetch Sections</button> 
<table border="1">
        <thead>
          <tr>
            <th>Course</th>
            <th>Title</th>
            <th>Section</th>
            <th>Building</th>
            <th>Room</th>
            <th>Times</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody> 
          {sections.map((section) => (
            <tr key={section.secNo}>
              <td>{section.courseId}</td>
              <td>{section.title}</td>
              <td>{section.secId}</td>
              <td>{section.building}</td>
              <td>{section.room}</td>
              <td>{section.times}</td>
              <td>
              <Link to="/assignments" state={section}>
                  Assignments
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorSectionsView;