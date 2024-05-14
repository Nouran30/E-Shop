import validateMiddleware from '../../middlewares/validate.js'
import { check } from 'express-validator'
import slugify from 'slugify';

export const brandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validateMiddleware,
];

export const createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand required')
        .isLength({ min: 3 })
        .withMessage('Too short Brand name')
        .isLength({ max: 32 })
        .withMessage('Too long Brand name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validateMiddleware
]

export const updateBrandValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Brand Id Format!"),

    check("name")
        .optional()
        .notEmpty()
        .withMessage("The Brand is not must be null")
        .isLength({ min: "3" })
        .withMessage("The Name Is Short Brand Name")
        .isLength({ max: "32" })
        .withMessage("The Name Is Long Brand Name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    validateMiddleware
]