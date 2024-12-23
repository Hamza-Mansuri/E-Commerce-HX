import jwt from "jsonwebtoken";
import User from '../models/userModels.js';
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async(req, res, next) => {

    let token;

    // Read JWT from jwt cookie
    token = req.cookies.jwt;

    if(token)
    {
        try
        {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // It’s a custom property added to the req object to store user-related information.
            req.user = await User.findById(decoded.userId).select("-password");
            next();

        }catch(err){
    
            throw new Error("Not authorized, token failed")
        }
    }else
    {
        throw new Error("Not Authorized, no token")
    }

    
});

const auhtorizeAdmin = (req, res, next) => {

    if(req.user && req.user.isAdmin)
    {
        next();
    }else{

        throw new Error("user is not authorized as Admin");
    }
}

export {authenticate, auhtorizeAdmin};