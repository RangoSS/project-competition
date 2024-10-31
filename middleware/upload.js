// upload.js
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const storage = new GridFsStorage({
    url: process.env.URI, // MongoDB URI from environment variables
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/png', 'image/jpg', 'image/jpeg'];
        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-any-name-${file.originalname}`;
        }

        return {
            bucketName: 'photos', // The GridFS bucket name where images will be stored
            filename: `${Date.now()}-any-name-${file.originalname}`
        };
    }
});

const upload = multer({ storage });

export default upload;
