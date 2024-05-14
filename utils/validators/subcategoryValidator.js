import validateMiddleware from '../../middlewares/validate.js'
import { check } from 'express-validator';
import slugify from 'slugify';
import Category from '../../models/category.js';
import ApiError from '../apiError.js';
export const subCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validateMiddleware,
];

export const createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('SubCategory required')
        .isLength({ min: 2 })
        .withMessage('Too short Subcategory name')
        .isLength({ max: 32 })
        .withMessage('Too long Subcategory name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category')
        .notEmpty()
        .withMessage('subCategory must be belong to category')
        .isMongoId()
        .withMessage('Invalid Category id format')
        .custom(async (categoryId) => {
            try {
                const category = await Category.findById(categoryId)
                if (!category) {
                    return Promise.reject(
                        new Error(`No category for this id: ${categoryId}`)
                    );
                }
                return true;
            } catch (err) {
                console.log(err);
                return Promise.reject(new ApiError("Internal Server Error", 500));
            }
        }),
    validateMiddleware,
];

export const updateSubCategoryValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid subCategory Id Format!"),
    check("name")
        .optional()
        .notEmpty()
        .withMessage("The SubCategory is not must be null")
        .isLength({ min: "2" })
        .withMessage("The Name Is Short subCategory Name")
        .isLength({ max: "32" })
        .withMessage("The Name Is Long subCategory Name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check("category")
        .optional()
        .notEmpty()
        .withMessage("The subCategory id is required")
        .isMongoId()
        .withMessage("Invalid Category id format")
        .custom(async (categoryId) => {
            try {
                const category = await Category.findById(categoryId)
                if (!category) {
                    console.log("error");
                    return Promise.reject(
                        new Error(`No category for this id: ${categoryId}`)
                    );
                }
                console.log("true");
                return true;
            } catch (err) {
                console.log(err);
                return Promise.reject(new ApiError("Internal Server Error", 500));
            }
        }),
    validateMiddleware,
]