import validateMiddleware from '../../middlewares/validate.js'
import { check } from 'express-validator';
import Review from '../../models/review.js';
import ApiError from '../apiError.js';
export const reviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validateMiddleware,
];

export const createReviewValidator = [
    check('title')
        .optional(),
    check('ratings')
        .isNumeric()
        .isFloat({ min: 1, max: 5 })
        .withMessage('rating must be a number between 1 and 5'),
    check('user').isMongoId().withMessage('Invalid user id format'),
    check('product').isMongoId().withMessage('Invalid invalid id format')
        .custom(async (val, { req }) => {
            // Check if logged user create review before
            const review = await Review.findOne({ user: req.loggedUser._id, product: req.body.product })

            if (review) {
                return Promise.reject(new Error('You already created a review before'))
            }

            return true;
        }),
    validateMiddleware,
];

export const updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            // Check review ownership before update
            const review = await Review.findById(val);
            if (!review) {
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }

            if (review.user._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(
                    new Error(`Your are not allowed to perform this action`)
                );
            }

        }),
    validateMiddleware,
]


export const deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            // Check review ownership before update
            const review = await Review.findById(val);
            if (!review) {
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }

            if (review.user._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(
                    new Error(`Your are not allowed to perform this action`)
                );
            }

        }),
    validateMiddleware,
]

