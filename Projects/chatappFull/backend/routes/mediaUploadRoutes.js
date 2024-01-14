const multer = require('multer');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public');
    },
    filename:(req, file, cb)=>{
        let fileType = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}-${req.headers.filename}.${fileType}`);
    }
})

const upload = multer({storage: storage})
router.get('/', (req, res) => {
    res.send('Media upload routes are working!');
});

router.post('/upload' ,upload.single('clientfile'), (req, res) => {
    res.json({
        message: 'File uploaded successfully!'
    });
});

module.exports = router;
