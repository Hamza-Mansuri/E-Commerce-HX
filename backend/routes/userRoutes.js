import express from "express";

import { createUser, loginUser, logoutCurrentUser, getAllUseres, geCurrentUserProfile, updateCurrentUserProfile , deleteUserById, getUserById, updateUserById} from "../controllers/userControllers.js";

import { authenticate, auhtorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
.route('/')
.post( createUser )
// to get all useres user should be authenticated, should be admin, and then only he can get all user access
.get(authenticate, auhtorizeAdmin, getAllUseres);

router.post('/auth', loginUser)
router.post('/logout',logoutCurrentUser)

//now user want to see specifically his profile and want to update

router
.get('/profile', authenticate, geCurrentUserProfile)
//to Update the User
.put('/profile',authenticate, updateCurrentUserProfile)
;

// ADMIN ROUTES

router
.route('/:id')
.delete(authenticate, auhtorizeAdmin, deleteUserById)
.get(authenticate, auhtorizeAdmin, getUserById)
.put(authenticate, auhtorizeAdmin, updateUserById)

export default router;