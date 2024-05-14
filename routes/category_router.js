import { Router } from "express";
import * as categoryController from "../services/category_controller.js";
import { createCategoryValidator, categoryValidator, updateCategoryValidator } from "../utils/validators/CategoryValidator.js"
import subcategoryRouter from './subcategory_router.js'

import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = Router();


router.post('/', categoryController.uploadCategoryImage, categoryController.resizeImage, createCategoryValidator, categoryController.addCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryValidator, categoryController.getCategoryById);
router.put('/:id',categoryController.uploadCategoryImage,categoryController.resizeImage,updateCategoryValidator, categoryController.updateCategory);
router.delete('/:id', categoryValidator, categoryController.deleteCategory);

router.use('/:categoryId/subcategories', subcategoryRouter);

export default router;
