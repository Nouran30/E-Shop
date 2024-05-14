import { Router } from 'express'
import * as reviewController from '../services/review_controller.js'
import { reviewValidator, createReviewValidator, updateReviewValidator } from '../utils/validators/reviewValidator.js';
import authenticate from '../middlewares/authentication.js';
import allowedTo from '../middlewares/authorization.js';

const router = Router({ mergeParams: true });


router.post('/', authenticate, allowedTo('user'), reviewController.setBodyProductId, createReviewValidator, reviewController.addReview);
router.get('/', reviewController.filter, reviewController.getAllReviews);
router.get('/:id', reviewValidator, reviewController.getReviewById);
router.put('/:id', authenticate, allowedTo('user'), updateReviewValidator, reviewController.updateReview);
router.delete('/:id', authenticate, allowedTo('user', 'admin'), reviewValidator, reviewController.deleteReview);


export default router;