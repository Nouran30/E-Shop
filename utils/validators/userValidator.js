import validateMiddleware from '../../middlewares/validate.js'
import { check, body } from 'express-validator';
import slugify from 'slugify';
import ApiError from '../apiError.js';
import User from '../../models/user.js'
import bcrypt from 'bcrypt';
export const userValidator = [
    check('id').isMongoId().withMessage('Invalid user id format'),
    validateMiddleware,
]

export const createUserValidator = [
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
    check('role').optional(),

    validateMiddleware,
];

export const updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in user'));
                }
            })
        ),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profileImg').optional(),
    check('role').optional(),
    validateMiddleware,
]

export const updateLoggedUserValidator = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('name required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .optional()
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error('E-mail already in user'));
                }
            })
        ),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('profileImg').optional(),
    check('role').optional(),
    validateMiddleware,
]

export const changeUserPasswordValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format '),
    check('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password'),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter the password confirm'),
    check('newPassword')
        .notEmpty()
        .withMessage('You must enter new password')
        .custom(async (val, { req }) => {
            try {
                const user = await User.findById(req.params.id)
                if (!user) {
                    return Promise.reject(new Error('There is no user for this id'));
                }
                
                const isCorrectPass = await bcrypt.compare(req.body.currentPassword, user.password);

                if (!isCorrectPass) {
                    return Promise.reject(new Error('Incorrect current password'));
                }

                if (val !== req.body.passwordConfirm) {
                    throw new Error('Password Confirmation incorrect');
                }

                return true;

            } catch (err) {
                console.log(err);
                throw new ApiError("Internal Server Error", 500);
            }
        }),

    validateMiddleware,
]

export const changeLoggedUserPasswordValidator = [
    check('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password'),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter the password confirm'),
    check('newPassword')
        .notEmpty()
        .withMessage('You must enter new password')
        .custom(async (val, { req }) => {
            try {
                const user = await User.findById(req.loggedUser._id)

                if (!user) {
                    return Promise.reject(new Error('There is no user for this id'));
                }

                console.log(req.body.currentPassword);
                console.log(user.password);
                const isCorrectPass = await bcrypt.compare(req.body.currentPassword, user.password);

                if (!isCorrectPass) {
                    return Promise.reject(new Error('Incorrect current password'));
                }

                if (val !== req.body.passwordConfirm) {
                    return Promise.reject(new Error (`Incorrect confirmation `));
                }

                return true;

            } catch (err) {
                throw new ApiError("Internal Server Error", 500);
            }
        }),

    validateMiddleware,
]