import { Router } from "express";
import * as brandController from '../services/brand_controller.js'
import { createBrandValidator, brandValidator, updateBrandValidator } from "../utils/validators/brandValidator.js";

const router = Router();

router.post('/', brandController.uploadBrandImage, brandController.resizeImage, createBrandValidator, brandController.addBrand);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandValidator, brandController.getBrandById);
router.put('/:id', brandController.uploadBrandImage,brandController.resizeImage,updateBrandValidator, brandController.updateBrand);
router.delete('/:id', brandValidator, brandController.deleteBrand);

export default router;