// /routers/userRoutes.js
import express from 'express';
import { CreateUser ,LoginUser} from '../controller/userController.js';

const router = express.Router();

// POST endpoint to create a new user
router.post('/user-info', CreateUser);

router.post('/login', LoginUser);

// Example route for adding a product (admin only)
router.post('/api/products', (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    // Code to add product...
});

// Example route for updating a product (admin only)
router.put('/api/products/:id', (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    // Code to update product...
});

// Example route for deleting a product (admin only)
router.delete('/products/:id', (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Permission denied' });
    }
    // Code to delete product...
});

// Example route for getting products (any user can read)
router.get('/products', (req, res) => {
    // Code to get products...
});


export default router;
