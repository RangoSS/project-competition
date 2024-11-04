// /routers/userRoutes.js
import express from 'express';
import { CreateUser ,LoginUser ,addProduct ,getProducts} from '../controller/userController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

// POST endpoint to create a new user
router.post('/user-info', CreateUser);

router.post('/login', LoginUser);

router.post('/products', upload.single('photo'), addProduct);

router.get('/products', getProducts);


// Example route for adding a product (admin only)


export default router;
