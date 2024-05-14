import slugify from 'slugify';
import validateMiddleware from '../../middlewares/validate.js'
import { check, body } from 'express-validator'

export const categoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validateMiddleware,
];

export const createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Category required')
        .isLength({ min: 3 })
        .withMessage('Too short Category name')
        .isLength({ max: 32 })
        .withMessage('Too long Category name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validateMiddleware
]

export const updateCategoryValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Category Id Format!"),

    check("name")
        .optional()
        .notEmpty()
        .withMessage("The Category is not must be null")
        .isLength({ min: "3" })
        .withMessage("The Name Is Short Category Name")
        .isLength({ max: "32" })
        .withMessage("The Name Is Long Category Name")
        .custom((val , {req})=>{
            req.body.slug = slugify(val);
            return true;
        }),

    validateMiddleware
]