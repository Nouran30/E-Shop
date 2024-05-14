import Brand from "../models/brand.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from '../utils/apiError.js';
import sharp from "sharp";
import * as handlerFactory from "./handlersfactory.js"
import { uploadSingleImage } from "../middlewares/mutlerMiddleware.js";

// Upload single image
export const uploadBrandImage = uploadSingleImage;

// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
    if(req.file){
        const { buffer } = req.file;
        const type = req.file.mimetype.split('/')[1]
        console.log(type);
        const filename = `brand-${Date.now()}.${type}`;

        await sharp(buffer)
            .resize(600, 600)
            .jpeg({ quality: 95 })
            .toFile(`uploads/brand/${filename}`);

        // Save image into our db
        req.body.image = filename;
    }

    next();

})


export const addBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const addedBrand = await Brand.create({ name, slug: slugify(name) });
    return res.status(201).json({ addedBrand });
})

export const getAllBrands = asyncHandler(async (req, res) => {
    const limit = req.query.page * 1 || 5;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;

    const allBrands = await Brand.find({}).limit(limit).skip(skip);
    return res.status(200).json({ page: page, results: allBrands.length, data: allBrands });
})


export const getBrandById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
        return next(new ApiError("Invalid Id", 404))
    }

    return res.status(200).json({ data: brand });

})

export const deleteBrand = handlerFactory.deleteOne(Brand);


export const updateBrand = handlerFactory.updateOne(Brand);