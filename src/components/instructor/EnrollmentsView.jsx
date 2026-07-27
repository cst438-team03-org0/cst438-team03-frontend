import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [editedEnrollments, setEditedEnrollments] = useState();
 
  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
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
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, []);

  setEditedEnrollments((prev) => {
    const updatedEnrollment = updatedEnrollments.find(
      (e) => e.enrollmentId === enrollmentId
    );
    
    const exists = prev.some(
      (e) => e.enrollmentId === enrollmentId
    );

    if(exists) {
      return prev.map((e) =>
      e.enrollmentId === enrollmentId ? updatedEnrollment : e
    );
    }
    return [...prev, updatedEnrollment];
  })

  const handleGradeChange = (grade, enrollmentId) => {
    const updatedEnrollments = enrollments.map((e) => {
      if (e.enrollmentId === enrollmentId) {
        return { ...e, grade: grade === "" ? null : grade };
      }
      return e;
    });
    setEnrollments(updatedEnrollments);
  };

  const saveGrades = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/enrollments`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(editedEnrollments),
        }
      );
      if (response.ok) {
        setMessage('Grades saved');
        setEditedEnrollments([]);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />

      <table className="Center">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>
                <input
                  type="text"
                  placeholder="A, B+, C-"
                  value={e.grade ?? ""}
                  onChange={(event) => handleGradeChange(event.target.value, e.enrollmentId)}
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="Center">
        <button onClick={saveGrades}>Save Grades</button>
      </div>
    </>
  );
}

export default EnrollmentsView;
