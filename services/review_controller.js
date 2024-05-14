import Review from "../models/review.js"
import * as handlerFactory from "./handlersfactory.js"
import asyncHandler from "express-async-handler";

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getAllReviews = handlerFactory.getAll(Review)

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReviewById = handlerFactory.getOne(Review)

// @desc    Create review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
export const addReview = handlerFactory.createOne(Review)

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
export const deleteReview = handlerFactory.deleteOne(Review);

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
export const updateReview = handlerFactory.updateOne(Review);

// products/:productId/reviews get reviews of specific product
export const filter = asyncHandler((req,res,next)=>{
    let filterObject = {};

    if(req.params.productId){
        filterObject={product:req.params.productId};
    }

    next();
})

// products/:productId/reviews add review for specific product
export const setBodyProductId = asyncHandler((req, res, next) => {
    if (!req.body.product) {
        req.body.product=req.params.productId;
    }
    
    next();
})