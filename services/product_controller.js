import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from '../utils/apiError.js';
import sharp from "sharp";
import ApiFeatures from "../utils/apiFeatures.js";
import * as handlerFactory from "./handlersfactory.js"
import { uploadMixedImages } from "../middlewares/mutlerMiddleware.js";


export const uploadProductImages = uploadMixedImages;
export const resizeProductImages = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const type = req.files.imageCover[0].mimetype.split('/')[1]
        const imageCoverFileName = `product-${Date.now()}-cover.${type}`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFile(`uploads/products/${imageCoverFileName}`);

        // Save image into our db
        req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${Date.now()}-${index + 1}.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);

                // Save image into our db
                req.body.images.push(imageName);
            })
        );
    }
    
    next();
});

export const addProduct = asyncHandler(async (req, res) => {

    const addedProduct = await Product.create(req.body);
    return res.status(201).json({ addedProduct });
})

export const getAllproducts = asyncHandler(async (req, res) => {
    //build query
    const documentCount = await Product.countDocuments();
    let apiFeature = new ApiFeatures(Product.find(), req.query)
        .filter()
        .paginate(documentCount)
        .sort()
        .search()
        .limitedfields()

    //execute query
    const { mongooseQuery, paginationResult } = apiFeature
    const allproducts = await mongooseQuery;
    return res.status(200).json({ results: allproducts.length, paginationResult, data: allproducts });

})

export const deleteProduct = handlerFactory.deleteOne(Product);

export const updateProduct = handlerFactory.updateOne(Product);