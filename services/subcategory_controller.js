import SubCategory from '../models/subCategory.js';
import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from '../utils/apiError.js';
import * as handlerFactory from "./handlersfactory.js"

export function setBodyCategoryId(req, res, next) {
    if (!req.body.category) {
        req.body.category = req.params.categoryId
    }
    next()
}

// categories/:categoryId/subcategories add subcategory for specific category
export const addSubcategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    const addedSubcategory = await SubCategory.create({ name, slug: slugify(name), category });
    return res.status(201).json({ addedSubcategory });
})

export const filter = (req , res ,next)=>{
    let filterObject = {};

    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId }
    }
    req.filterObject = filterObject
    next()
}

// nested routes
// categories/:categoryId/subcategories get subcategories of specific category
export const getAllSubcategories =handlerFactory.getAll;


export const getSubcategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id)
    //populate({ path: 'category', select: 'name -_id ' });

    if (!subCategory) {
        return next(new ApiError("Invalid Id", 404))
    }

    return res.status(200).json({ data: subCategory });

})

export const deleteSubcategory = handlerFactory.deleteOne(SubCategory);

export const updateSubcategory = handlerFactory.updateOne(SubCategory);
