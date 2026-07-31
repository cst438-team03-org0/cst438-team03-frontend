import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment({ ...assignment, secNo: secNo, title: '', dueDate: '' });
    // to be implemented.  invoke showModal() method on the dialog element.
    dialogRef.current.showModal();
  };

  const closeDialog = () => {
    if(dialogRef.current) {
      dialogRef.current.close();
    }
    if (onClose) {
      onClose();
    }
  };

  const saveAssignment = async () => {
    if (!assignment.title || !assignment.dueDate) {
      setMessage('Please provide both title and due date');
      return;
    }
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(assignment),
        }
      );
      if (response.ok) {
        setMessage('Assignment added successfully');
        closeDialog();
      } else {
        const body = await response.json();
        setMessage(body.message || JSON.stringify(body));
      } 
    } catch (err) {
      setMessage(err.toString());
    } 
  };
  return (
    <>
      <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
      <dialog ref={dialogRef} >
        <h2>Add Assignment</h2>
        <Messages response={message} />
        <label>Title: </label>
        <input id="titleInput" type="text" value={assignment.title} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
        <br />
        <div> 
          <label>Due Date: </label>
          <input id="dueDateInput" type="date" value={assignment.dueDate} onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />
          <button id="closeButton" onClick={closeDialog}>Close</button>
          <button id="saveButton" onClick={saveAssignment}>Save</button>
        </div>
      </dialog>
    </>
  );
};

export default AssignmentAdd;