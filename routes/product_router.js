import { Router } from "express";
import * as productController from "../services/product_controller.js";
import { createProductValidator , updateProductValidator , productValidator} from "../utils/validators/productValidator.js"
import reviewRouter from './review_router.js'
const router = Router();

router.post('/',productController.uploadProductImages,productController.resizeProductImages, createProductValidator, productController.addProduct);
router.get('/', productController.getAllproducts);
router.delete('/:id',productController.deleteProduct);
router.get('/:id', productValidator )
router.put('/:id' , updateProductValidator , productController.updateProduct);

router.use('/:productId/reviews', reviewRouter );

export default router;