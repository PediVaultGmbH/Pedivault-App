const router = require('express').Router({ mergeParams: true });
const ctrl   = require('../controllers/vaccines.controller');
const { authenticate }   = require('../middleware/auth');
const { childOwnership } = require('../middleware/childOwnership');

router.use(authenticate, childOwnership);
router.get   ('/',    ctrl.getVaccineRecords);
router.post  ('/',    ctrl.logVaccine);
router.put   ('/:id', ctrl.updateVaccineRecord);
router.delete('/:id', ctrl.deleteVaccineRecord);

module.exports = router;
