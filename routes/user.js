const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    validateName, 
    validateEmail, 
    validatePassword
} = require('../utils/validators');
const User = require('../models/userModel');

router.post("/signup", async(req, res ) => {
    try{
        const { name, email, password, isSeller } = req.body;
        const existingUser = await User.findOne({ where:  {email} });
        if(existingUser){
            return res.status(403).json({err : "User already exists"});
        }
        if(!validateName(name)){
            return res.status(400).json({err: "Name validation fails"});
        }
        if(!validateEmail(email)){
            return res.status(400).json({err: "Email validation fails"});
        }
        if(!validatePassword(password)){
            return res.status(400).json({err: "Password validation fails"});
        }
        const hashedPassword = await bcrypt.hash(password,(saltOrRounds=10)); //we can use salts here to make the hashedPassword more secure
        const user = {
            name,
            email,
            isSeller,
            password: hashedPassword
        }
        const createdUser = await User.create(user);
        return res.status(201).json({
            message: `Welcome ${createdUser.name}`,
        });
    } catch(e) {
        console.log(e);
        return res.status(500).send(e);
    }
})

router.post("/signin", async(req, res ) => {
    try{
        const { email, password } = req.body;
        if(email.length == 0) {
            return res.status(400).json({
            err: "Please provide email"
            });
        }
        if(password.length == 0) {
            return res.status(400).json({
            err: "Please provide password"
            });
        }
        const existingUser = await User.findOne({where: {email}});
        if(!existingUser){
            return res.status(404).json({
                err: "User not found"
            });
        }
        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatched){
            return res.status(400).json({
                err: "Email or password mismatch"
            });
        }
        const payload = { user : { id: existingUser.id }};
        const bearerToken = jwt.sign(payload, "SECRET MESSAGE", {
            expiresIn: 1*60*60*10 // 1 Hr in ms
        }); //secret message does the same thing what salt was doing
        
        res.cookie('x-token', bearerToken, {expire: new Date() + 36000}); //in ms
        return res.status(200).json({
            bearerToken
        })

    } catch( e ){
        return res.status(500).send(e);
    }
})

router.get('/signout', (req,res) => {
    //just delete the x-token, so that user wont be able to call any API after signout (will also delete the token from db or anywhere else if saved)
    try{
        res.clearCookie('x-token');
        return res.status(200).json({
            message: 'cookie deleted'
        });
    } catch( e ){
        return res.status(500).send(e);
    }
})

module.exports = router;