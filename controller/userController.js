// /controller/userController.js
import { auth, db } from '../config/firebase.js'; // Make sure these are correctly defined in your Firebase config
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Combine imports from firebase/firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'your_jwt_secret_key'; // Ensure this is kept secure, ideally in an environment variable

export const CreateUser = async (req, res) => {
    const { email, password, username, displayName, phone, address, country, role } = req.body;

    try {
        // Hash the password before sending it to Firebase
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, hashedPassword);
        const user = userCredential.user;

        // Store additional user data in Firestore (you can also choose to store the hashed password if needed)
        await setDoc(doc(db, 'users', user.uid), {
            email,
            username,
            displayName,
            phone,
            address,
            country,
            role,
            createdAt: serverTimestamp(),
            // Optionally store the hashed password
            // hashedPassword,  // Uncomment if you want to store it
        });

        return res.status(201).json({ message: 'User registered successfully', userId: user.uid });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
    }
};


// Function to log in a user
export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'User data not found' });
        }

        const userData = userDoc.data();

        // Generate a JWT token
        const token = jwt.sign(
            { uid: user.uid, username: userData.username, role: userData.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Set token expiration time
        );

        // Send the token back to the client
        return res.status(200).json({ message: 'User logged in successfully', token, userData });
    } catch (error) {
        console.error('Error logging in:', error);
        // Handle specific error codes
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ error: 'No user found with this email' });
        } else if (error.code === 'auth/wrong-password') {
            return res.status(401).json({ error: 'Incorrect password' });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};