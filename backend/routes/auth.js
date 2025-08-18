const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret_here';
var fetchuser= require('../middleware/fetchuser');

//ROUTE:1 CREATE A USER USING: POST "/api/auth/createuser"
router.post('/createuser', [  // ❗ Use POST, not GET
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
      let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        //  Await the user find query
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry, a user with this email already exists" });
        }

        //  Don't reassign imported `User` model. Use a different variable name.
        const salt = await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password, salt)
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
         user:{
            id:newUser.id
         }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
         res.json({success, authtoken});
        //res.json(newUser);
        //Catch Errors
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE:2 Authentication a user using: Post "/api/auth/login".
  router.post('/login', [  
    body('email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success=false;
       const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password}= req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
       success=false;
         return res.status(400).json({success, error:"Please try to login with correct Password"});
      }
      const passwordCompare= await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success=false;
          return res.status(400).json({success,error:"Please try to login with correct Password"});
      }
     const data = {
         user:{
            id:user.id
         }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success= true;
         res.json({success, authtoken});
        //res.json(newUser);
        //Catch Errors
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE:3 Authentication a user using: Post "/api/auth/getuser".
router.post('/getuser',fetchuser, async (req, res) => {
try{
   const userId=req.user.id;
   const user= await User.findById(userId).select("-password");
   res.send(user);
} catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
   });
module.exports = router;

