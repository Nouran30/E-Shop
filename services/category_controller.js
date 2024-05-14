import Category from "../models/category.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from "../utils/apiError.js";
import sharp from "sharp";
import * as handlerFactory from "./handlersfactory.js"
import { uploadSingleImage } from "../middlewares/mutlerMiddleware.js";

export const uploadCategoryImage =uploadSingleImage;

export const resizeImage = asyncHandler(async (req, res, next) => {
   if(req.file){
       const { buffer } = req.file;
       const type = req.file.mimetype.split('/')[1]
      
       const filename = `category-${Date.now()}.${type}`;

       await sharp(buffer)
           .resize(600, 600)
           .jpeg({ quality: 95 })
           .toFile(`uploads/category/${filename}`);

       // Save image into our db
       req.body.image = filename;
       next();
   }

})

export const addCategory = handlerFactory.createOne(Category)

export const getAllCategories = handlerFactory.getAll(Category)

export const getCategoryById = handlerFactory.getOne(Category)

export const deleteCategory = handlerFactory.deleteOne(Category);

export const updateCategory = handlerFactory.updateOne(Category);