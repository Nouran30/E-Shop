import asyncHandler from "express-async-handler";
import slugify from "slugify"
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export function deleteOne(Model) {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const deletedItem = await Model.findByIdAndDelete(id);

        if (!deletedItem) {
            return next(new ApiError("Invalid Id", 404))
        }

        return res.status(200).json({ message: `${Model.modelName} Deleted` });
    })
}

export function updateOne(Model) {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params;


        const updatedItem = await Model.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedItem) {
            return next(new ApiError("Invalid Id", 404))
        }

        return res.status(200).json({ message: "Item Updated", updatedItem });
    })
}

export function getOne(Model) {
    return asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const item = await Model.findById(id);

        if (!item) {
            return next(new ApiError(`No item for this id ${id}`, 404));
        }

        res.status(200).json({ data: item });
    });
}

export function createOne(Model) {
    return asyncHandler(async (req, res) => {
        const newItem = await Model.create(req.body);
        res.status(201).json({ data: newItem });
    });
}

export function getAll(Model) {
    return asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObject) {
            filter = req.filterObject;
        }
        // Build query
        const documentCount = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .paginate(documentCount)
            .sort()
            .search()
            .limitedfields()

        // Execute query
        const { mongooseQuery, paginationResult } = apiFeatures;
        const documents = await mongooseQuery;

        res.status(200).json({ results: documents.length, paginationResult, data: documents });
    });
}
