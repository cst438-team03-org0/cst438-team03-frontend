import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();


  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    // to be implemented.  invoke showModal() method on the dialog element.
    // dialogRef.current.showModal();
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



  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
    <>
      <button id="gradeButton" onClick={editOpen}>Grade</button>
      <dialog ref={dialogRef}>
        <p>To be implemented.  Display table with columns headings as given in headers.
          <h2> Assignment Grades</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Score</th>
                <th>Save</th>
              </tr>
            </thead>

      
        {/* For each student, display and allow the user to edit the student's score.
          Buttons for Close and Save. */}
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.studentName}</td>
                <td>{grade.studentEmail}</td>
                <td><input type="number" value={grade.score} onChange={(e) => {
                  const newGrades = [...grades];
                  newGrades[index].score = e.target.value;
                  setGrades(newGrades);
                }} /></td>
                <td><button>Save</button></td>
              </tr>
            ))} 
          </tbody>
        </table>
        </p>

      </dialog>
    </>
  );
}

export default AssignmentGrade;