const { Router } = require('express');
const expController = require('../controllers/expController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', expController.all_exp);
router.post('/', requireAuth,expController.post_exp);

module.exports = router;
