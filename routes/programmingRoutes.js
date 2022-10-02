const { Router } = require('express');
const programmingController = require('../controllers/programmingController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

/////////////
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });
router.get('/create',requireAuth,programmingController.create_page);
router.post('/',requireAuth, upload.single('image'), programmingController.create_req);
////
router.get('/all', requireAuth, programmingController.all_questions)
/////
router.get('/',requireAuth,programmingController.all_page);
router.get('/:title',requireAuth,programmingController.type_page);
router.get('/:title/:id',requireAuth,programmingController.question_page);
router.post('/qcreate',requireAuth, programmingController.create_question);


module.exports = router;
