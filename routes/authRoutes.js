const { Router } = require('express');
const authController = require('../controllers/authController');
const multer = require('multer');
const { storage } = require('../cloudinary/cloudinary');
const upload = multer({ storage });

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', upload.single('image'), authController.signup_post);
// router.post('/signup', upload.single('image'), (req, res) => {
//     console.log(req.body.data, typeof (req.body.data), typeof (JSON.parse(req.body.data)), req.file)
// })
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.post('/update', upload.single('image'), authController.update_post);
router.get('/logout', authController.logout_get);

module.exports = router;