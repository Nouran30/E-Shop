import { Router } from "express";
import * as userController from "../services/user_controller.js";
import { userValidator, createUserValidator, updateUserValidator, changeLoggedUserPasswordValidator, changeUserPasswordValidator, updateLoggedUserValidator } from "../utils/validators/userValidator.js";
import authenticate from "../middlewares/authentication.js";
import allowedTo from "../middlewares/authorization.js";

const router = Router();

router.use(authenticate);
//user
router.get('/getMe', userController.getLoggedUserData, userValidator, userController.getUser);
router.put('/updateMyPassword', changeLoggedUserPasswordValidator, userController.updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, userController.updateLoggedUserData);

//admin

router.use(allowedTo('admin', 'manger'))
router.post('/', createUserValidator, userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userValidator, userController.getUser);
router.put('/:id', updateUserValidator, userController.updateUser);
router.put('/:id',changeUserPasswordValidator,userController.changeUserPassword)
router.delete('/:id', userValidator, userController.deleteUser);

export default router;