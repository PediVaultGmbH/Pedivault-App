const router = require('express').Router({ mergeParams: true });
const ctrl   = require('../controllers/medications.controller');
const { authenticate }   = require('../middleware/auth');
const { childOwnership } = require('../middleware/childOwnership');

router.use(authenticate, childOwnership);
router.get   ('/',    ctrl.getMedications);
router.post  ('/',    ctrl.addMedication);
router.put   ('/:id', ctrl.updateMedication);
router.delete('/:id', ctrl.deleteMedication);

module.exports = router;
