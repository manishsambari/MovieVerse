const router = require('express').Router();
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Save to 'images' folder in root
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Timestamp + extension
    },
});

const upload = multer({ storage: storage });

// Upload Endpoint
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json("No file uploaded");
        }
        // Return the path that will be accessible via static serve
        // e.g., /images/12512512.jpg
        res.status(200).json('/images/' + req.file.filename);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
