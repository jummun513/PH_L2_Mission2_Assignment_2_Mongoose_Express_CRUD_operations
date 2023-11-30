import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getUsers);
router.put('/:userId', UserController.updateSingleUser);
router.get('/:userId', UserController.getSingleUser);
router.delete('/:userId', UserController.deleteSingleUser);
router.put('/:userId/orders', UserController.orderAdd);
router.get('/:userId/orders', UserController.getAllOrder);
router.get('/:userId/orders/total-price', UserController.totalOrderPrice);

export const UserRoutes = router;
