import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from "../utils/apiError.js";
import sharp from "sharp";
import bcrypt from 'bcrypt';
import * as handlerFactory from "./handlersfactory.js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = handlerFactory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = handlerFactory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users/
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    return res.status(201).json({ data: user });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = handlerFactory.deleteOne(User);


// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, slug, phone, email, profileImg, role } = req.body;
    const document = await User.findByIdAndUpdate(
        id,
        {
            name,
            slug,
            phone,
            email,
            profileImg,
            role,
        },
        {
            new: true,
        }
    )

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }

    return res.status(200).json({ data: document });
});

// @desc    Update user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
export const changeUserPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, parseInt(process.env.SALT_ROUNDS));
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword, passwordChangedAt: Date.now(), }, { new: true });

    if (!updatedUser) {
        return next(new ApiError(`No User for this id ${req.params.id}`, 404));
    }

    return res.status(200).json({ data: updatedUser });
});

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.loggedUser._id;
    next()
})

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
export const updateLoggedUserPassword = asyncHandler(async (req, res) => {
    const { _id } = req.loggedUser;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, parseInt(process.env.SALT_ROUNDS));
    const updatedPassword = await User.findByIdAndUpdate(_id, { password: hashedPassword, passwordChangedAt: Date.now(), }, { new: true });

    if (!updatedPassword) {
        return next(new ApiError(`No User for this id ${_id}`, 404));
    }

    const token = jwt.sign({ id: _id }, process.env.TOKEN_SECRET, { expiresIn: "3h" });
    return res.status(200).json({ data: updatedPassword, token });
})

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
export const updateLoggedUserData = asyncHandler(async (req, res) => {
    const { name, email, slug, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.loggedUser._id, { name, slug, email, phone }, { new: true });
    if (!updatedUser) {
        return next(new ApiError(`No User for this id ${req.loggedUser._id}`, 404));
    }

    return res.status(200).json({ data: updatedUser });
})