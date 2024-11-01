//const multer = require('multer');
import multer from 'multer';
// Use memory storage to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;
