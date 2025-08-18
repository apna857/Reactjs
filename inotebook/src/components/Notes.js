import React, { useContext,useState, useEffect, useRef } from 'react';
import noteContext from '../Context/notes/noteContext';
import Noteitem from './Noteitem';
import Addnote from './Addnote';
import { useNavigate } from 'react-router-dom';


export default function Notes(props) {
  const {showAlert}=props;
  const { notes,  getNotes, editNote} = useContext(noteContext); 
   const navigate=useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({id:"", etitle: "", edescription: "", etag: "" });
  useEffect(()=>{
    if (localStorage.getItem('token')){
    getNotes();
    }
    else{
    navigate("/login");
    }
     
  },[navigate]);
  const  updateNote=(currentNote)=>{
   ref.current.click();
     setNote({id:currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    showAlert("Updated Successfully","success");
    }
 
   const handleClick = (e) => {
   console.log("Updating the note...",note)
   editNote(note.id, note.etitle, note.edescription, note.etag)
   refClose.current.click();
   showAlert("Updated Successfully","success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <div> 
    <Addnote showAlert={showAlert}/>
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div className="modal-body">
               <form classname="my-3">
                
                 
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text"  className="form-control" id="etitle" name="etitle"  value={note.etitle}  onChange={onChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input  type="text"  className="form-control" id="edescription"  name="edescription" value={note.edescription}  onChange={onChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text"   className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
        </div>
      </form>
            </div>
            <div className="modal-footer">
              <button  ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal" >
                Close
              </button>
              <button type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>

    <div className='row my-3'>
      <h4>Your Notes</h4>
      {notes.length===0 &&
      <div className='container'>No notes to display </div>
      }
  
      {notes.map((note) => (
        <Noteitem key={note._id} updateNote={ updateNote} note={note} showAlert={props.showAlert} />
       
      ))}
      </div>
    </div>
  );
}
