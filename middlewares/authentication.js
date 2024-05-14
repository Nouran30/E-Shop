import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ApiError from "../utils/apiError.js";
import dotenv from "dotenv";
dotenv.config()
async function authenticate(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return next(new ApiError(`token not provided`, 404));
        }

        const { id, iat } = jwt.verify(authorization, process.env.TOKEN_SECRET)

        if (!id) {
            return next(new ApiError(`payload not provided`, 404));
        }

        const user = await User.findById(id)

        if (!user) {
            return next(new ApiError(`Invalid request , user doesnt have access for that request`, 404));
        }

        if (user.passwordChangedAt) {
            const passChangedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000);
            // Password changed after token created (Error)
            if (passChangedTimestamp > iat) {
                return next(
                    new ApiError('User recently changed your password. please login again..', 401)
                )
            }
        }
        req.loggedUser = user;
        next();
    } catch (err) {
        return next(new ApiError(`Internal server error`, 500));
    }
}
export default authenticate;