import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
const allowedTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.loggedUser.role)) {
            return next(new ApiError(`You are not allowed to access this route`, 403))
        }
        next();
    })
}

export default allowedTo;