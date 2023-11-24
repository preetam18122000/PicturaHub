const express = require('express');
const router = express.Router();
const {
    validateName, 
    validateEmail, 
    validatePassword
} = require('../utils/validators');
const User = require('../models/userModel');

router.post("/signup", async(req, res )=>{
    try{
        const { name, email, password, isSeller } = req.body;
        const existingUser = await User.findOne({ where: ( email )});
        if(existingUser){
            return res.status(403).json({err : "User already exists"});
        }
        if(!validateName(name)){
            res.status(400).json({err: "Name validation fails"});
        }
        if(!validateEmail(email)){
            res.status(400).json({err: "Email validation fails"});
        }
        if(!validatePassword(password)){
            res.status(400).json({err: "Password validation fails"});
        }
    } catch(e) {
        return res.status(500).send(e);
    }
})

module.exports = router;