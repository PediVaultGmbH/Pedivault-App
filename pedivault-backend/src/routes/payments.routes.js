const router  = require('express').Router();
const ctrl    = require('../controllers/payments.controller');
const { authenticate } = require('../middleware/auth');

router.post('/create-subscription', authenticate, ctrl.createSubscription);
router.post('/cancel-subscription', authenticate, ctrl.cancelSubscription);
router.get ('/subscription',        authenticate, ctrl.getSubscription);
router.post('/webhook',             ctrl.webhook);

module.exports = router;
