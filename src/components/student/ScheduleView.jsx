import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
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
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  // deletes the request
  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('jwt'),
            },
          }
      );
      if (response.ok) {
        setMessage('Course dropped');
        fetchEnrollments(term.year, term.semester);
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
  // to confirm that student will drop
  const onDrop = (enrollmentId) => {
    confirmAlert({
      title: 'Confirm to drop',
      message: 'Do you want to drop this course?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropEnrollment(enrollmentId),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const headings = ["enrollmentId", "sectionNo", "courseId", "sectionId", "building", "room", "times", ""];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
      <table className="Center">
        <thead>
        <tr>
          {headings.map((h, idx) => (
              <th key={idx}>{h}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.sectionNo}</td>
              <td>{e.courseId}</td>
              <td>{e.sectionId}</td>
              <td>{e.building}</td>
              <td>{e.room}</td>
              <td>{e.times}</td>
              <td><button onClick={() => onDrop(e.enrollmentId)}>Drop</button></td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );

}

export default ScheduleView;