import React, { useContext } from 'react';
import noteContext from '../Context/notes/noteContext';

const Noteitem = (props) => {
  const { note, updateNote, showAlert } = props;
  const { deleteNote } = useContext(noteContext);

  return (
    <div className='col-md-3'>
      <div className="card my-3 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="d-flex justify-content-end">
            <i
              className='far fa-trash-alt text-danger mx-2'
              onClick={() => {
                deleteNote(note._id);
                showAlert("Deleted Successfully", "success");
              }}
              role="button"
            >
            </i>

            <i
              className='far fa-edit text-primary mx-2'
              onClick={() => {
                updateNote(note);
                showAlert("Loaded note for update", "info");
              }}
              role="button"
            >
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
