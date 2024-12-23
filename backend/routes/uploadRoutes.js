import express from "express";

import path from 'path';

import multer from 'multer';

const router = express.Router()

// multer: Middleware for handling multipart/form-data, typically used for file uploads.
const storage = multer.diskStorage({
    
    //This method specifies where the uploaded files will be saved.
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    //This method specifies how the uploaded files will be named.
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
});

//we dont want other to upload exe file or other sort of files
const fileFilter = (req, file, cb) => {

    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase()

    const mimetype = file.mimetype;

    if(filetypes.test(extname) && mimetypes.test(mimetype))
    {
        cb(null, true);
    }else{

        cb(new Error("Images Only"), false);
    }

}


const upload = multer({storage, fileFilter})

                                //this should be same while entering the image test
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {

    uploadSingleImage(req, res, (err) => {

        if(err)
        {
            res.status(500).send({message: err.message});
 
        }
        else if(req.file){

            res.status(200).send({
                message: "image uploaded successfully",
                image: `/${req.file.path}`,

            });
        }
        else
        {
            res.status(500).send({  message: "No image provided"});
        }
    });
});


export default router;