import express from 'express';
import upload from '../middleware/upload.js'; // File upload middleware (if needed)
import { 
    postUser, 
    createTodo, 
    getTodo,
    getUser
} from '../controller/userController.js'; // Importing from your controller

const router = express.Router();

// POST endpoint to add an employee
router.post('/todo', createTodo);

router.post('/user-info', upload.single('photo'), postUser);

// GET endpoint to retrieve all employees
router.get('/todo', getTodo);

// GET endpoint to retrieve all employees
router.get('/user-info', getUser);

// GET endpoint to count employees
//router.get('/employees/count', getAllEmployeesCount);

// PUT endpoint to update an employee
//router.put('/employees/:employeeId', upload.single('photo'), updateEmployee);

// DELETE endpoint to delete an employee by ID
//router.delete('/employees/:employeeId', deleteEmployee);

export default router; // Correctly export the router
