import validateMiddleware from '../../middlewares/validate.js'
import { check } from 'express-validator';
import slugify from 'slugify';
import Category from '../../models/category.js';
import SubCategory from '../../models/subCategory.js';
import ApiError from '../apiError.js';
import Brand from '../../models/brand.js';

export const productValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validateMiddleware,
]


export const createProductValidator = [
    check('title')
        .isLength({ min: 3 })
        .withMessage('must be at least 3 chars')
        .isLength({ max: 100 })
        .withMessage('must be less than 100 characters')
        .notEmpty()
        .withMessage('Product required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('description')
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ max: 2000 })
        .withMessage('Too long description'),

    check('modelName')
        .optional()
        .notEmpty()
        .withMessage('Product model name is not must be null')
        .isLength({ min: 2 })
        .withMessage("must be at least 2 characters")
        .isLength({ max: 30 })
        .withMessage('Too long modelName'),

    check('quantity')
        .optional()
        .notEmpty()
        .withMessage('Product quantity is not must be null')
        .isNumeric()
        .withMessage('Product quantity must be a number'),

    check('sold')
        .optional()
        .isNumeric()
        .withMessage('Product quantity must be a number'),

    check('price')
        .notEmpty()
        .withMessage('Product price is required')
        .isNumeric()
        .withMessage('Product price must be a number')
        .custom((val) => {
            if (val <= 0) return false
            return true
        })
        .withMessage('To less price')
        .isLength({ max: 1000000 })
        .withMessage('To long price'),

    check('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('Product priceAfterDiscount must be a number')
        .toFloat()
        .custom((value, { req }) => {

            if (req.body.price <= value) {
                throw new Error('priceAfterDiscount must be lower than price');
            }

            return true;
        }),

    check('colors')
        .optional()
        .isArray()
        .withMessage('availableColors should be array of string'),

    check('imageCover')
        .notEmpty()
        .withMessage('Product imageCover is required'),

    check('images')
        .optional()
        .isArray()
        .withMessage('images should be array of string'),

    check('category')
        .notEmpty()
        .withMessage('Product must be belong to a category')
        .isMongoId()
        .withMessage('Invalid ID formate')
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

    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID formate')
        .custom(async (subcategoryId, { req }) => {
            try {
                const subcategory = await SubCategory.find({ _id: { $exists: true, $in: subcategoryId } })
                if (subcategory.length != req.body.subcategories.length) {
                    return Promise.reject(
                        new Error(`No subcategory for this id: ${subcategoryId}`)
                    );
                }
                return true;
            } catch (err) {
                console.log(err);
                return Promise.reject(new ApiError("Internal Server Error", 500));
            }
        })
        .custom(async (subcategoriesId, { req }) => {
            try {
                const subcategories = await SubCategory.find({ category: req.body.category })
                const subcategoriesIdDb = [];
                subcategories.forEach((subCategory) => {
                    subcategoriesIdDb.push(subCategory._id.toString())
                })

                const checker = subcategoriesId.every((subCategory) => {
                    return subcategoriesIdDb.includes(subCategory)
                })

                if (!checker) {
                    return Promise.reject(
                        new Error(`subcategories not belong to category`)
                    );
                }

                return true;

            } catch (err) {
                console.log(err);
                return Promise.reject(new ApiError("Internal Server Error", 500));
            }
        }),
    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID formate')
        .custom(async (brandId) => {
            try {
                const brand = await Brand.findById(brandId)
                if (!brand) {
                    return Promise.reject(
                        new Error(`No brand for this id: ${brandId}`)
                    );
                }
                return true;
            } catch (err) {
                console.log(err);
                return Promise.reject(new ApiError("Internal Server Error", 500));
            }
        }),
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('ratingsAverage must be a number')
        .isLength({ min: 1 })
        .withMessage('Rating must be above or equal 1.0')
        .isLength({ max: 5 })
        .withMessage('Rating must be below or equal 5.0'),
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('ratingsQuantity must be a number'),

    validateMiddleware,
]

export const updateProductValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Product Id Format!"),

    check("title")
        .optional()
        .notEmpty()
        .withMessage("The Product is not must be null")
        .isLength({ min: "3" })
        .withMessage("The title Is Short Product title")
        .isLength({ max: "32" })
        .withMessage("The title Is Long Product title")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    validateMiddleware
]