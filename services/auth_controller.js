import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import sharp from "sharp";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cryptoRandomString from 'crypto-random-string';
import { sendMail } from "../utils/mailService.js";
dotenv.config()

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
    const { name, email, phone, slug, password, profileImg } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
    const user = await User.create({ name, slug, email, phone, password: hashedPassword, profileImg });
    return res.status(201).json({ data: user });
})

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return next(new ApiError(`Incorrect email or password`, 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "3h" });
    return res.status(200).json({ data: user, token });
})

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgetPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError(`User not found`, 404));
    }

    const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: "10h" })
    const code = cryptoRandomString({ length: 6, type: 'numeric' });
    const html = `<h1>Forget Password Code : ${code}</h1>`
    await sendMail(email, "Forget Password", "", html)
    const updateUser = await User.updateOne({ email }, { forgetPasswordCode: code }, { new: true })
    return res.status(200).json({ message: "email sent", token });


})

// @desc    Verify Code
// @route   POST /api/v1/auth/verifyCode
// @access  Public
export const verifyCode = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new ApiError(`token not provided`, 404));
    }

    const { email } = jwt.verify(authorization, process.env.TOKEN_SECRET);

    if (!email) {
        return next(new ApiError(`payload not provided`, 404));
    }

    const user = await User.findOne({ email });

    if (!user.forgetPasswordCode || user.forgetPasswordCode != code) {
        return next(new ApiError(`Invalid code `, 404));
    }

    const updatedUser = await User.updateOne({ email }, { forgetPasswordCodeVerified: true }, { new: true });
    const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: "10h" });
    return res.status(200).json({ message: "success code", token });

})

// @desc    change password
// @route   POST /api/v1/auth/changePassword
// @access  Public
export const changePassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new ApiError(`token not provided`, 404));
    }

    const { email } = jwt.verify(authorization, process.env.TOKEN_SECRET);

    const user = await User.findOne({ email });

    if (!user || !user.forgetPasswordCodeVerified) {
        return next(new ApiError(`Invalid request , code not provided...`, 404));
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
    const updatedUser = await User.updateOne({ email }, { forgetPasswordCodeVerified: false, forgetPasswordCode: null, password: hashedPassword }, { new: true })

    if (!updatedUser) {
        return next(new ApiError(`Invalid request `, 404));
    }

    return res.status(200).json({ data: updatedUser });
})

