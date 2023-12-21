const multer = require('multer');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/')[1];
        console.log(req.headers.filename);
        cb(null, `${Date.now()}-${req.headers.filename}.${fileType}` );
    }
});

const upload = multer({storage: storage});

router.get('/', (req, res) => {
    res.send('Media upload routes are working!');
});
router.post('/upload', upload.single('clientfile'), (req, res) => {
    // console.log(req.body.filename);
    res.send('File uploaded');
});

module.exports = router;