import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment, onClose }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();


  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    // to be implemented.  invoke showModal() method on the dialog element.
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
           'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  // Handler for save button that will add to grades (following GradeController)
  const saveGrades = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(grades),
      });

      if (response.ok) {
        setMessage('Grades saved');

        // refresh assignment list, if needed
        if (onClose) {
          onClose();
        }
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

  //replaced inline onChange to match GradeDTO and ensure
  const handleScoreChange = (value, index) => {
    const score = value === '' ? null : parseInt(value, 10);

    setGrades((prev) =>
    prev.map((g, i) => (i === index ? {...g, score} : g))
    );
  };

  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
    <>
      <button id="gradeButton" onClick={editOpen}>Grade</button>
      <dialog ref={dialogRef}>
          <h2> Assignment Grades</h2>
          <Messages response = {message} />
          <table border="1">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Score</th>
              </tr>
            </thead>

      
        {/* For each student, display and allow the user to edit the student's score.
          Buttons for Close and Save. */}
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.studentName}</td>
                <td>{grade.studentEmail}</td>
                <td>
                  <input id={`scoreInput-${index}`} type="number" min="0" max ="100" value={grade.score ?? ''}
                  onChange={(e) => handleScoreChange(e.target.value, index)} />
                </td>
              </tr>
            ))} 
          </tbody>
        </table>
        
        <div>
          <button id="saveGradesButton" onClick = {saveGrades}>Save</button>
          <button id="closeGradesButton" onClick = {editClose}>Close</button>
        </div>
      </dialog>
    </>
  );
}

export default AssignmentGrade;