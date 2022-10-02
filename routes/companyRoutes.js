const { Router } = require('express');
const companyController = require('../controllers/companyController');
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
////

router.get('/',companyController.all_company);
router.post('/', requireAuth, upload.single('image'),companyController.new_company);

module.exports = router;
