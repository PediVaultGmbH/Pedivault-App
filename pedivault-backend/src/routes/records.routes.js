const router  = require('express').Router({ mergeParams: true });
const ctrl    = require('../controllers/medicalRecords.controller');
const multer  = require('multer');
const { authenticate }   = require('../middleware/auth');
const { childOwnership } = require('../middleware/childOwnership');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','application/pdf'];
    if (!allowed.includes(file.mimetype))
      return cb(new Error('Only JPG, PNG, WEBP and PDF files are allowed'));
    cb(null, true);
  },
});

router.use(authenticate, childOwnership);
router.get   ('/',        ctrl.getRecords);
router.post  ('/upload',  upload.single('file'), ctrl.uploadRecord);
router.post  ('/',        ctrl.uploadRecord);
router.delete('/:id',     ctrl.deleteRecord);

module.exports = router;
