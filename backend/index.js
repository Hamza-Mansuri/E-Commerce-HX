//Packages
import path from 'path';

import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

import express from 'express';

//Utilities
import connectDB from './config/db.js';

import userRouter from "./routes/userRoutes.js";
// import router from './routes/userRoutes.js';

import categoryRoutes from './routes/categoryRoutes.js';

import productRoutes from './routes/productRoutes.js';

import uploadRoutes from './routes/uploadRoutes.js';

import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

// app.get("/", (req, res) => {

//     res.send("get res Hello World")
// })

app.use("/api/users", userRouter);

app.use('/api/category', categoryRoutes)

app.use('/api/products', productRoutes)

app.use('/api/upload', uploadRoutes)

app.use('/api/orders', orderRoutes)

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

app.get('/api/config/paypal', (req, res) => {

    res.send({clientId: process.env.PAYPAL_CLIENT_ID});
});

app.listen(port, () => {

    console.log(`Server is Running on port: ${port}`);
    
})