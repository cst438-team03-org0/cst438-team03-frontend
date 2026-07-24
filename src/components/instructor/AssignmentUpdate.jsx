import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {


  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
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
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
           'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(assignment),
        }
      );
      if (response.ok) {
        setMessage('Assignment updated successfully');
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
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        {/* <p>  Show the id, title and due date of the assignemnt.
            Allow user to edit the title and due date.
            Buttons for Close and Save. </p> */}

        <h2>Edit Assignment</h2>
        <Messages response={message} />
        <label>Title: </label>  
        <input type="text" value={assignment.title} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
        <br />
        <label> id: </label>
        <input type="text" value={assignment.id} readOnly />
        <br />
        <div> 
          <label>Due Date: </label>
          <input type="date" value={assignment.dueDate} onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />  
          <button onClick={closeDialog}>Close</button>
          <button onClick={saveAssignment}>Save</button>
        </div>
      </dialog>
    </>
  )
}

export default AssignmentUpdate;
