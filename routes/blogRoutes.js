const { Router } = require('express');
const blogController = require('../controllers/blogController');
const { requireAuth} = require('../middleware/authMiddleware');
const router = Router();

router.get('/create',requireAuth, blogController.blog_create_get);
router.get('/userblogs', requireAuth, blogController.get_user_blogs);
router.get('/',blogController.blog_index);
router.post('/',requireAuth,blogController.blog_create_post);
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);

module.exports = router;