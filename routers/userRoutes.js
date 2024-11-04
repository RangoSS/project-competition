// /routers/userRoutes.js
import express from 'express';
import { CreateUser } from '../controller/userController.js';

const router = express.Router();

// POST endpoint to create a new user
router.post('/user-info', CreateUser);

export default router;
