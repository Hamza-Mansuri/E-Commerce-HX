import User from "../models/userModels.js";

import asyncHandler from "../middlewares/asyncHandler.js";
// const asyncHandler = require("../middlewares/asyncHandler")

//encrypting the password by Salt
import bcrypt from 'bcryptjs';

import createToken from "../utils/createToken.js";



const createUser = asyncHandler(async (req,res) => {

    const {username, email, password} = req.body

    // console.log(username);
    // console.log(email);
    // console.log(password);
    
    //validation part
    if(!username || !email || !password)
    {
        throw new Error("Please Fill All The Inputs");
    }

    //checking if user exitis or not, bcz email is unique
    const userExits = await User.findOne({email});

    if(userExits) res.status(400).send("User Already Exists");

    //Creating User
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    //creating object of User from userModel
    const newUser = new User({username, email, password: hashedPassword});

    //create token for the new user
    createToken(res, newUser._id);

    try{

        //to print the message, that something has happened
        await newUser.save();

        res.status(201)
        .json(
            {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            }
    );

    }catch(error){
        res.status(400);

        throw new Error("Invalid user Data");
        
    }

    
    
});

//Login User

const loginUser = asyncHandler(async(req, res) => {

    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser)
    {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if(isPasswordValid)
        {
            createToken(res, existingUser._id);
    
            res.status(201)
            .json({
                    _id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                    isAdmin: existingUser.isAdmin,
                }
            )
            return;
        }
    }

});

//Logout User

const logoutCurrentUser = asyncHandler(async(req, res) => {

    res.cookie('jwt', '', {

        httpOnly:true,
        expires: new Date(0),
    })

    res.status(200).json({message: "Successfully logedOut"});
})

//Get ALl Users

const getAllUseres = asyncHandler(async(req, res) => {

    const users = await User.find({})

    //this will send(show) all the data.
    res.send(users);
})

//geCurrentUserProfile

const geCurrentUserProfile = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id)

    // console.log(req.user._id);
    

    //if user id is found
    if(user)
    {
        res.status(200).json({

            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{

        throw new Error("User Not Found")
    }
})

//updateCurrentUser

const updateCurrentUserProfile = asyncHandler(async(req, res) => {

    //getting all user data by this req.user._id
    const user = await User.findById(req.user._id);

    if(user)
    {
        //if user does not update the name, stick to the old one || user.username
        user.username = req.body.username || user.username;

        user.email = req.body.email || user.email;

        if(req.body.password)
        {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);   
            user.password = hashedPassword;
        }


        //saving the user with updated information
        const updatedUser = await user.save();

        res.json({

            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            
        })
    }else{
        res.status(404)
        throw new Error("updateCurrentUser Error")
    }
})

// ADMIN SIDE

// Delete user at Admin Side

const deleteUserById = asyncHandler(async(req, res) => {

    const user = await User.findById(req.params.id)

  
    if(user)
    {

        if(user.isAdmin)
        {
            res.status(400)
            throw new Error("Admin Cannot be Deleted")
        }

        //delete one user
        //by its _id: user._id
        await User.deleteOne({_id: user._id})
        res.json({message: "User Removed"})

    }else{
        res.status(404)
        throw new Error("deleteUserById user not found")
    }
})

// getUserById

const getUserById = asyncHandler(async(req,res) => {

    const user = await User.findById(req.params.id).select('-password')

    if(user)
    {
        // No Need Of this

        // await User.findOne({id: user._id})

        // // res.json({message: "User Found"})

        // res.status(201).json({

        //     username: user.username,
        //     email: user.email,
        //     isadmin: user.isAdmin
        // })

        res.json(user)
        
    }else{

        res.status(404)
        throw new Error("getUserById user Not Found")
    }
})

// updateUserById

const updateUserById = asyncHandler(async(req,res) => {

    const user = await User.findById(req.params.id)

    if(user)
    {

        user.username = req.body.username || user.username;

        user.email = req.body.email || user.email;

        user.isAdmin = Boolean(req.body.isAdmin);

        // ADMIN is not supposed to change the user password

        // if(req.body.password)
        // {
        //     const salt = await bcrypt.genSalt(10)
        //     const hashedPassword = await bcrypt.hash(req.body.password , salt)

        //     user.password = hashedPassword
        // }

        //save user in var, and send the respponse 
        const updatedUser = await user.save();

        res.json({

            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            // password: updatedUser.password,
            isAdmin: updatedUser.isAdmin,
        })
    }else
    {
        res.status(404)
        throw new Error("updateUserById User not Found")
    }
})

export {createUser, loginUser, logoutCurrentUser, getAllUseres, geCurrentUserProfile, updateCurrentUserProfile, deleteUserById, getUserById, updateUserById};