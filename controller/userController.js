// /controller/userController.js
import { auth, db } from '../config/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

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
