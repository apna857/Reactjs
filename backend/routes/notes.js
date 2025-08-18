const express =require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note= require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes" -- Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error("Fetch Notes Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE:2 Add a new Note using: POst "/api/notes/addnote. "
router.post('/addnote', fetchuser,[
        body('title').isLength({ min: 3 }),
          body('description').isLength({ min: 5 }),
],async(req, res)=>{
    try{
    const{title,description,tag}= req.body;
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note =new Note({
     title, description, tag,user:req.user.id
    });
    const savedNote = await note.save()
    res.json(savedNote)
} catch (error) {
    console.error("Fetch Notes Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE:3 Update an existing Note using: Put "/api/notes/updatenote. "
router.put('/updatenote/:id', fetchuser,async(req, res)=>{
  const{title, description, tag} = req.body;
  //create a newNote object
  const newNote ={};
  if(title) newNote.title = title;
  if(description) newNote.description = description;
  if(tag) newNote.tag = tag;
  //Find the note to be updated and update it
 
  try{
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}

  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note});
}  catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE:4 Update an existing Note using: Delete "/api/notes/deletenote. "
router.delete('/deletenote/:id', fetchuser,async(req, res)=>{
 try{
  
  //Find the note to be updated and delete it
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}

  //Allow deletion only if user owns this note
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");

  }
  note = await Note.findByIdAndDelete(req.params.id)
  res.json({"Success":"Note has been Deleted"});
}catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports =router