import validateMiddleware from '../../middlewares/validate.js'
import { check, body } from 'express-validator';
import slugify from 'slugify';
import ApiError from '../apiError.js';
import User from '../../models/user.js'


export const signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('User required')
        .isLength({ min: 3 })
        .withMessage('Too short User name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            try {
                const user = await User.findOne({ email: val });
                if (user) {
                    return Promise.reject(new Error(`Email already exist`));
                }
                return true;
            } catch (error) {
                console.log(err);
                throw new ApiError("Internal Server Error", 500);
            }
        }),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profileImg').optional(),

    validateMiddleware,
];

export const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validateMiddleware,
]