import { Router } from "express";
import * as subcategoryController from '../services/subcategory_controller.js';
import { subCategoryValidator, createSubCategoryValidator, updateSubCategoryValidator } from '../utils/validators/subcategoryValidator.js'

const router = Router({ mergeParams: true });

router.post('/', subcategoryController.setBodyCategoryId, createSubCategoryValidator, subcategoryController.addSubcategory);
router.get('/', subcategoryController.filter,subcategoryController.getAllSubcategories);
router.get('/:id', subCategoryValidator, subcategoryController.getSubcategoryById);
router.put('/:id', updateSubCategoryValidator, subcategoryController.updateSubcategory);
router.delete('/:id', subCategoryValidator, subcategoryController.deleteSubcategory);

export default router;

//    categories/:categoryId/subcategories get subcategories of specific category

//    categories/:categoryId/subcategories add subcategory for specific category