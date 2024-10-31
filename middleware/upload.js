import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';

const storage = new GridFsStorage({
    db: mongoose.connection, // Use the established database connection
    file: (req, file) => {
        const match = ['image/png', 'image/jpg', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-any-name-${file.originalname}`;
        }

        return {
            bucketName: 'photos', // Bucket name must match the reference in the schema
            filename: `${Date.now()}-any-name-${file.originalname}`
        };
    }
});

const upload = multer({ storage });

export default upload;
