import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const [notes, setNotes] = useState([]);

  // Get all notes
  const getNotes = async () => {
    console.log("Getting all notes");
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });

    const json = await response.json();
    console.log("Fetched notes:", json);
    setNotes(json);
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    console.log("Adding a new note");
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });

    const json = await response.json();
    console.log("Note added:", json);
    setNotes((prevNotes) => [...prevNotes, json]);
  };

  const deleteNote = async (id) => {
  console.log("Deleting note with id:", id);

  const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
    }
  });

  const json = await response.json();
  console.log("Note deleted:", json);

  // Remove note from state
  const updatedNotes = notes.filter((note) => note._id !== id);
  setNotes(updatedNotes);
};


  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    console.log("Editing note");
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });

    const json = await response.json();
    console.log("Note updated:", json);

    const updatedNotes = notes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
