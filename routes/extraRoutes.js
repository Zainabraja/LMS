const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/addtask', authController.addtask_post);
router.post('/updatetask', authController.updatetask_post)
router.post('/deletetask', authController.deletetask_post)
router.post('/markcomplete', authController.markcomplete_post)

module.exports = router;