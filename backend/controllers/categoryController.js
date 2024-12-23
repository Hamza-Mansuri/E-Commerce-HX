import Category from '../models/categoryModel.js';

import asyncHandler from "../middlewares/asyncHandler.js";

import bcrypt from 'bcryptjs';


//createCategory
const createCategory = asyncHandler(async(req, res) => {

    try 
    {

        const {name} = req.body;

        // console.log(name);

        if(!name)
        {
            return res.json({error: "Name is Required"})
        }

                                                //this is database field "name":
                                                //if both fields are same don't need to ({name: var})
        const existingCategory = await Category.findOne({name});

        if(existingCategory)
        {
            return res.json({error: "Category already Exits"});
        }

        //we are creating new category
        const category = await new Category({name}).save();
        res.json(category);

    } catch (error) 
    {
        console.log(error);
        return res.status(400).jsom(error)
    }
})

//updateCategory
const updateCategory = asyncHandler(async(req,res) => {

    

    try 
    {
        
    const {name} = req.body;

    const {categoryId} = req.params;
    //req.params._id

    //in findOne we have to enter Object
    // const category = await Category.findById(req.params.categoryId);
    const category = await Category.findOne({_id: categoryId})

    if(!category)
    {
        return res.status(404).json({error: "Category Not Found"})
    }

    //category name has been updated by newly name added by admin.
    //.name with this we are going into the database, (like which we have created in the model.)
    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "updateCategory Error"})
        
    }
})

//deleteCategory
const removeCategory = asyncHandler(async(req, res) => {

    try 
    {
    
        const removed = await Category.findByIdAndDelete(req.params.categoryId)

        res.json(removed)
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "deleteCategory Error"})
    }

})

//listCategory
const listCategory = asyncHandler(async(req, res) => {

    try 
    {

        const all = await Category.find({});

        res.json(all);
        
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
        
    }
})

//readCategory
const readCategory = asyncHandler(async(req, res) => {

    try 
    {
    
        const category = await Category.findOne({_id: req.params.id})

        res.json(category);

    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
        
    }
})

export { createCategory, updateCategory, removeCategory, listCategory, readCategory };