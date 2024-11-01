// middleware/auth.js
import jwt from 'jsonwebtoken';
import { roles, permissions } from '../roles/roles.js'; // Import roles and permissions

// Middleware for authentication
export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

// Middleware to check permissions
export const authorize = (action) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!permissions[role] || !permissions[role].includes(action)) {
            return res.status(403).send({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
        next();
    };
};
