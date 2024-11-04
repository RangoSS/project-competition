// /controller/userController.js
import { auth, db } from '../config/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const CreateUser = async (req, res) => {
    const { email, password, username, displayName, phone, address, country, role } = req.body;

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email,
            username,
            displayName,
            phone,
            address,
            country,
            role,
            createdAt: serverTimestamp(),
        });

        return res.status(201).json({ message: 'User registered successfully', userId: user.uid });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
    }
};
