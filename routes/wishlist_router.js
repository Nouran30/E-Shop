import { Router } from "express";
import * as wishlistController from '../services/wishlist_controller.js';
import authenticate from "../middlewares/authentication.js";
import allowedTo from "../middlewares/authorization.js";

const router = Router();
router.use(authenticate, allowedTo('user'))
router.post('/', wishlistController.addProductToUserWishlist);
router.delete('/:productId', wishlistController.removeProductToUserWishlist);
router.get('/',wishlistController.getLoogedUserWishlist);
export default router;