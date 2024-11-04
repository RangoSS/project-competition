// /controller/userController.js
import { auth, db ,storage  } from '../config/firebase.js'; // Make sure these are correctly defined in your Firebase config
import { getDoc, doc, setDoc, serverTimestamp ,where,collection,query } from 'firebase/firestore'; // Combine imports from firebase/firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
// Import the necessary functions from Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Add these imports at the top of your file


const JWT_SECRET = 'your_jwt_secret_key'; // Ensure this is kept secure, ideally in an environment variable
// Configure multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

export const addProduct = async (req, res) => {
    const { name, type, storeLocation, totalQuantity, description, category, contact, email } = req.body;
    const file = req.file;  // Access the uploaded file here

    try {
        // Create the product object without the photo initially
        const product = {
            name,
            type,
            storeLocation,
            totalQuantity,
            description,
            category,
            contact,
            email,
            createdAt: serverTimestamp(),
        };

        // Save product to Firestore and get the generated product ID
        const productRef = doc(collection(db, 'products')); // Automatically generate a unique ID
        await setDoc(productRef, product);
        
        let photoUrl = '';

        // Check if there is a file to upload
        if (file) {
            // Create a reference to the file in Firebase Storage using the product ID
            const storageRef = ref(storage, `products/${productRef.id}/${file.originalname}`); // Use product ID

            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file.buffer);

            // Get the download URL for the uploaded file
            photoUrl = await getDownloadURL(storageRef);
        }

        // Update the product with the photo URL
        await setDoc(productRef, { photo: photoUrl }, { merge: true });

        return res.status(201).json({ message: 'Product added successfully', productId: productRef.id });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Function to get products, optionally filtered by category
export const getProducts = async (req, res) => {
    const { category } = req.query; // Get the category filter from query params

    try {
        const productsCollection = collection(db, 'products');
        let productsQuery;

        // If a category is provided, filter products by category
        if (category) {
            productsQuery = query(productsCollection, where('category', '==', category));
        } else {
            productsQuery = productsCollection; // Get all products if no category is specified
        }

        const snapshot = await getDocs(productsQuery);
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Base64 to image URL if needed for frontend display
            photo: doc.data().photo ? `data:image/jpeg;base64,${doc.data().photo}` : null // Assuming the image is in JPEG format
        }));

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ error: error.message });
    }
};