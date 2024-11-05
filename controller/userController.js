
import { 
    getDoc, 
    doc, 
    setDoc, 
    serverTimestamp,
    where,
    collection,
    query,
    getDocs,
    deleteDoc
       // Include this line
} from 'firebase/firestore'; 
// /controller/userController.js
import { auth, db ,storage  } from '../config/firebase.js'; // Make sure these are correctly defined in your Firebase config
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
// Import the necessary functions from Firebase Storage
import { ref, uploadBytes, getDownloadURL,deleteObject } from 'firebase/storage'; // Add these imports at the top of your file


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
            hashedPassword,
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

    console.log('Login attempt:', { email }); // Log the login attempt with the provided email

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User credential received:', userCredential); // Log the received user credential

        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('User document:', userDoc.data()); // Log the retrieved user document

        if (!userDoc.exists()) {
            console.log('User data not found in Firestore'); // Log if user data is not found
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
        console.log('Token generated:', token); // Log the generated token
        return res.status(200).json({ message: 'User logged in successfully', token, userData });
    } catch (error) {
        console.error('Error logging in:', error);
        console.error('Error details:', error.message); // Log the specific error message
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
    const { name, type, storeLocation, totalQuantity, description, category, contact, email, price } = req.body; // Include price here
    const file = req.file;  // Access the uploaded file here

    try {
        // Create the product object with the price
        const product = {
            name,
            type,
            storeLocation,
            totalQuantity,
            description,
            category,
            contact,
            email,
            price, // Add the price to the product object
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
            // Directly use the photo URL stored in Firestore
            photo: doc.data().photo || null // No need to convert Base64, just take the URL
        }));

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error retrieving products:', error);
        return res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        // Reference to the users collection in Firestore
        const usersRef = collection(db, 'users');
        
        // Fetch all documents in the users collection
        const querySnapshot = await getDocs(usersRef);
        
        // Map through the documents and format the response
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id, // Firestore document ID
            ...doc.data(), // Document data
        }));

        return res.status(200).json({ users }); // Respond with the list of users
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: error.message }); // Handle errors
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters

    try {
        // Reference to the product document in Firestore
        const productRef = doc(db, 'products', id);
        
        // Check if the product exists before attempting to delete
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product document
        await setDoc(productRef, {}, { merge: true }); // Optional: to remove the document
        await deleteDoc(productRef); // Delete the document completely from Firestore
        
        // Optionally: Delete the associated photo from Firebase Storage if necessary
        const photoPath = `products/${id}/${productDoc.data().photo.split('/').pop()}`; // Extract the file name from the URL
        const storageRef = ref(storage, photoPath);
        await deleteObject(storageRef); // Delete the photo from Firebase Storage

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters
    const { name, type, storeLocation, totalQuantity, description, category, contact, email, price } = req.body; // Get the new product details
    const file = req.file; // Access the uploaded file if available

    try {
        // Reference to the product document in Firestore
        const productRef = doc(db, 'products', id);
        
        // Check if the product exists before attempting to update
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create the product update object
        const updatedProduct = {
            name,
            type,
            storeLocation,
            totalQuantity,
            description,
            category,
            contact,
            email,
            price,
            updatedAt: serverTimestamp(), // Track the update time
        };

        // Update the product in Firestore
        await setDoc(productRef, updatedProduct, { merge: true });

        // If a new file is uploaded, handle the file upload and old photo deletion
        if (file) {
            const existingPhotoUrl = productDoc.data().photo; // Get the existing photo URL
            if (existingPhotoUrl) {
                // Extract the file name from the existing photo URL to delete it from Storage
                const existingPhotoName = existingPhotoUrl.split('/').pop(); // Extract file name
                const existingPhotoPath = `products/${id}/${existingPhotoName}`; // Construct the path
                const existingPhotoRef = ref(storage, existingPhotoPath);
                
                // Delete the old photo from Firebase Storage
                await deleteObject(existingPhotoRef);
            }

            // Create a reference to the new file in Firebase Storage
            const newStorageRef = ref(storage, `products/${id}/${file.originalname}`);

            // Upload the new file to Firebase Storage
            await uploadBytes(newStorageRef, file.buffer);

            // Get the download URL for the uploaded file
            const photoUrl = await getDownloadURL(newStorageRef);

            // Update the product with the new photo URL
            await setDoc(productRef, { photo: photoUrl }, { merge: true });
        }

        return res.status(200).json({ message: 'Product updated successfully', productId: id });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ error: error.message });
    }
};
