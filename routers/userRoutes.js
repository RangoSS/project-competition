// /routers/userRoutes.js
import express from 'express';
import { CreateUser ,LoginUser ,addProduct ,getProducts ,deleteProduct,updateProduct,getUsers} from '../controller/userController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

// POST endpoint to create a new user
router.post('/user-info', CreateUser);
router.get('/user-info', getUsers);
router.post('/login', LoginUser);

router.post('/products', upload.single('photo'), addProduct);

router.get('/products', getProducts);


// Route for deleting a product
router.delete('/products/:id', deleteProduct);


router.put('/products/:id',upload.single('photo'), updateProduct);
// Example route for adding a product (admin only)


export default router;
