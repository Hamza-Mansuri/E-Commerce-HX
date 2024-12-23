import express from "express";

import formidable from 'express-formidable';
//bcz we are working with the FORM Data

import { authenticate, auhtorizeAdmin } from "../middlewares/authMiddleware.js";

import checkId from "../middlewares/checkId.js";

import { 
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProduct,

} from "../controllers/productController.js";


const router = express.Router();

router.route('/')
.post(authenticate, auhtorizeAdmin, formidable(), addProduct)
.get(fetchProducts)

//place general routes first
router.route('/allproducts').get(fetchAllProducts)

//in giving reviews, the user must NOT be authorized as an admin
router.route('/:id/reviews').post(authenticate, checkId, addProductReview)

router.get('/top', fetchTopProducts)
router.get('/new', fetchNewProducts)

//and then place specific routes afetr
router.route('/:id')
.put(authenticate, auhtorizeAdmin, formidable(), updateProductDetails)
.delete(authenticate, auhtorizeAdmin, removeProduct)
.get(fetchProductById)

router.route('/filtered-products').post(filterProduct)



export default router;