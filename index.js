import express from "express";
import path from 'path'
import dotenv from "dotenv";
import morgan from "morgan";
import DbConnection from "./config/DBConnection.js";
import categoryRouter from "./routes/category_router.js";
import ApiError from "./utils/apiError.js";
import globalError from './middlewares/errorMiddleware.js'
import subcategoryRouter from "./routes/subcategory_router.js";
import brandRouter from "./routes/brand_router.js";
import productRouter from './routes/product_router.js';
import userRouter from "./routes/user_router.js";
import authRouter from "./routes/auth_router.js";
import reviewRouter from "./routes/review_router.js";
import wishlistRouter from "./routes/wishlist_router.js";
import { fileURLToPath } from 'url';
import bodyParser from'body-parser';
import multer from 'multer';

const upload = multer();


dotenv.config()
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json());
app.use(morgan('tiny'));
// Serve images from the 'uploads/categories' directory
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.urlencoded({ extended: false }));


//data base
DbConnection();

//routes
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subcategories', subcategoryRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.all('*', (req, res, next) => {
    next(new ApiError(`cant find this route : ${req.originalUrl}`, 400));
})

// Global error handling middleware for express
app.use(globalError);

app.listen(3000, () => {
    console.log("running at port 3000 ");
})

