import { Router } from "express";
import * as authController from "../services/auth_controller.js";
import authenticate from "../middlewares/authentication.js";
import { signupValidator, loginValidator } from "../utils/validators/authValidator.js";

const router = Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.post('/verifyCode',authController.verifyCode);
router.post('/changePassword',authController.changePassword);
export default router;