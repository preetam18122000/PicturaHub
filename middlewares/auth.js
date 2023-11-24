const jwt = require('jsonwebtoken');


const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                err: "Auth Header not found"
            });
        }
        const token = authHeader.split(" ")[1]; 
        //we will get the token as -> Bearer TOKEN. 
        //We split it with space in between, and then fetching the second parameter
        if(!token){
            return res.status(401).json({
                err: "Token not found"
            });
        }
        const decoded_token = jwt.verify(token, "SECRET MESSAGE");
        //this will give us the object back which it was before it was coded in user.js
        // const payload = { user : { id: existingUser.id }};
        const existingUser = User.findOne({ where: { id: decoded_token.user.id }});
        if(!existingUser){
            return res.status(400).json({
                err: "User not found"
            });
        }
        req.user = existingUser; // To avoid calling db again in next call because req will be same throughout the route
        next();
    } catch (e) {
        return res.status(500).send(e);
    }
}

const isSeller = async (req, res, next) => {
    try {
        if ( req.user.isSeller){
            next();
        }
        return res.status(401).json({
            err: "You are not a seller"
        });
    } catch (e) {
        return res.status(500).send(e);
    }
}

module.exports = { isAuthenticated, isSeller };