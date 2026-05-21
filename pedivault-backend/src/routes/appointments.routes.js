const router = require('express').Router({ mergeParams: true });
const ctrl   = require('../controllers/appointments.controller');
const { authenticate }   = require('../middleware/auth');
const { childOwnership } = require('../middleware/childOwnership');

router.use(authenticate, childOwnership);
router.get   ('/',    ctrl.getAppointments);
router.post  ('/',    ctrl.bookAppointment);
router.put   ('/:id', ctrl.updateAppointment);
router.delete('/:id', ctrl.cancelAppointment);

module.exports = router;
