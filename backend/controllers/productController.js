import asyncHandler from "../middlewares/asyncHandler.js";

import Product from "../models/ProductModal.js";


const addProduct = asyncHandler(async(req,res) => {

                                                        //bcz we are working with the form
    const {name, price, quantity, description, brand, category} = req.fields;

    // console.log(name);
    // console.log(price);
    // console.log(quantity);
    // console.log(description);
    // console.log(brand);
    // console.log(category);


    try 
    {
    
        switch(true)
        {
            //Validation
            case !name:
                return res.json({error: "Name is required"});
            
            case !brand:
                return res.json({error: "brand is required"});
        
            case !description:
                return res.json({error: "description is required"});

            case !price:
                return res.json({error: "price is required"});
            
            case !category:
                return res.json({error: "category is required"});
        
            case !quantity:
                return res.json({error: "quantity is required"});
                
        }

        const product =  new Product({...req.fields});
        await product.save();
        res.json(product);

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }

})

const updateProductDetails = asyncHandler(async(req, res) => {

    const {name, price, quantity, description, brand, category} = req.fields;

    try 
    {
        switch(true)
        {
            //Validation
            case !name:
                return res.json({error: "Name is required"});
            
            case !brand:
                return res.json({error: "brand is required"});
        
            case !description:
                return res.json({error: "description is required"});

            case !price:
                return res.json({error: "price is required"});
            
            case !category:
                return res.json({error: "category is required"});
        
            case !quantity:
                return res.json({error: "quantity is required"});
                
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields}, {new: true});

        await product.save();

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json(error.message)
    }
})

const removeProduct = asyncHandler(async(req, res) => {

    try 
    {
    
        const removed = await Product.findByIdAndDelete(req.params.id)

        res.json(removed)

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

//New Concept
const fetchProducts = asyncHandler(async(req, res) => {

    try 
    {
        //for Forntend
        const pageSize = 6;
        const keyword = req.query.keyword 
        ?  { name: { $regex:  req.query.keyword, $options: "i"  } }
        : {};

        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword}).limit(pageSize)

        res.json(
            {
                products,
                page: 1,
                pages: Math.ceil(count / pageSize),
                hasMore: false,
            }
        );
        
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server Error"})
    }

    
})

const fetchProductById = asyncHandler(async(req, res) => {

    
    // const product = await Product.findOne({_id: req.params.id})
    
    // const product = await Product.findOne({name: req.params.name})

    try 
    {
        const product = await Product.findById(req.params.id)

        if(product)
        {
            res.json(product)
        }else{
            res.status(404);
            throw new Error("Product Not Found")
        }
        

    } catch (error) {
        console.error(error)
        res.status(404).json({error: "Product Not Found"})
    }

   
})

const fetchAllProducts = asyncHandler(async(req, res) => {

    try 
    {
        const products = await Product.find({})
        .populate("category")
        // .limit(12)
        .sort({ createAt: -1 });

        res.json(products)

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server Error"})
    }
})


//New Concpet
const addProductReview = asyncHandler(async(req, res) => {

    try 
    {
        //we are getting rating and coment
        const { rating, comment } = req.body;
        //we are getting the specific product on which the user is posting the comment
        const product = await Product.findById(req.params.id)

        if(product)
        {
            //checking alreadyReviewed
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() == req.user._id.toString()
            );

            if(alreadyReviewed)
            {
                res.status(400)
                throw new Error("Product Already Reviewd")
            }

            //if not alreadyRewiewed
            //we want to get username, rating, comment, userId
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };
    
            //we are pushing new review to it
            product.reviews.push(review);
            //updating the number of reviews
            product.numReviews = product.reviews.length;
    
            //increasing decreasing the ratings
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
            
            //saving the reviewed product
            await product.save();
            res.status(201).json({ message: "Review Added"})

        }else
        {
            res.status(404)
            throw new Error("Product Not Found")
        }

     } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

const fetchTopProducts = asyncHandler(async(req, res) => {

    try 
    {
    
        const products = await Product.find({}).sort({ rating: -1 }).limit(4)

        res.json(products)

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }

})

const fetchNewProducts = asyncHandler(async(req, res) => {

    try 
    {
    
        const products = await Product.find().sort({_id: -1}).limit(5)

        res.json(products)

    } catch (error) {
        console.error(error)
        res.status(400).json(error.message)
    }
})

const filterProduct = asyncHandler(async(req,res) => {

    

    try 
    {

        const {checked, radio} = req.body

        let args ={}

        if(checked.length > 0) args.category = checked;

        //greater than equals to, set index 0, lessthan equal to set index 1
        if(radio.length > 0 ) args.price = {$gte: radio[0], $lte: [1]}

        const products = await Product.find(args);

        res.json(products)

    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server Error"})
    }
})

export {addProduct, updateProductDetails, removeProduct, fetchProducts, fetchProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts, filterProduct};