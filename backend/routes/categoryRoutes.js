import express from "express";

import { authenticate, auhtorizeAdmin } from "../middlewares/authMiddleware.js";

import { 
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory
 } from "../controllers/categoryController.js";

const router = express.Router();

//Admin Rights
//Create Category
router.route('/').post( authenticate, auhtorizeAdmin, createCategory );

//Update Category
router.route('/:categoryId').put( authenticate, auhtorizeAdmin, updateCategory );

//Delete Category
router.route('/:categoryId').delete( authenticate, auhtorizeAdmin, removeCategory );

//Categories are used in shop, and for the admin panel
router.route('/categories').get(listCategory)

//Read Specific Category
router.route('/:id').get(readCategory);

export default router;