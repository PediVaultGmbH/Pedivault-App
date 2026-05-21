// src/routes/children.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/children.controller');
const { authenticate }    = require('../middleware/auth');
const { childOwnership }  = require('../middleware/childOwnership');

router.use(authenticate);
router.get   ('/',           ctrl.getChildren);
router.post  ('/',           ctrl.createChild);
router.get   ('/:childId',   childOwnership, ctrl.getChild);
router.put   ('/:childId',   childOwnership, ctrl.updateChild);
router.delete('/:childId',   childOwnership, ctrl.deleteChild);

module.exports = router;
