import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
export const addProductToUserWishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;
    const id = req.loggedUser._id
    const user = await User.findByIdAndUpdate(id, { $addToSet: { wishlist: productId } }, { new: true })

    if (!user) {
        return next(new ApiError('failed to add', 404))
    }

    return res.status(200).json({ message: "product added successfully to your wishlist", data: user })
})

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
export const removeProductToUserWishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const id = req.loggedUser._id
    const user = await User.findByIdAndUpdate(id, { $pull: { wishlist: productId } }, { new: true })

    if (!user) {
        return next(new ApiError('failed to add', 404))
    }

    return res.status(200).json({ message: "product removed successfully to your wishlist", data: user })
})

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
export const getLoogedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.loggedUser._id).populate('wishlist');

    return res.json({ result: user.wishlist.length, data: user.wishlist });
})