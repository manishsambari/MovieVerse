const router = require('express').Router();
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });


router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json("No file uploaded");
        }

        res.status(200).json('/images/' + req.file.filename);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
