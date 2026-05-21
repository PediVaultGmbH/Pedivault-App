const router = require('express').Router({ mergeParams: true });
const ctrl   = require('../controllers/growth.controller');
const { authenticate }   = require('../middleware/auth');
const { childOwnership } = require('../middleware/childOwnership');

router.use(authenticate, childOwnership);
router.get   ('/',    ctrl.getGrowthEntries);
router.post  ('/',    ctrl.addGrowthEntry);
router.delete('/:id', ctrl.deleteGrowthEntry);

module.exports = router;
