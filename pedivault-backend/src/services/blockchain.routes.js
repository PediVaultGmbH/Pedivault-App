const router = require('express').Router();
const blockchain = require('./blockchain.service');
const { authenticate } = require('../middleware/auth');

router.get('/status', authenticate, (req, res) => {
  res.json({ success: true, data: { enabled: blockchain.enabled } });
});

router.get('/child/:childId/records', authenticate, async (req, res, next) => {
  try {
    const records = await blockchain.getChildRecords(req.params.childId);
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
});

router.get('/child/:childId/certificates', authenticate, async (req, res, next) => {
  try {
    const certs = await blockchain.getChildCertificates(req.params.childId);
    res.json({ success: true, data: certs });
  } catch (err) { next(err); }
});

router.get('/child/:childId/audit', authenticate, async (req, res, next) => {
  try {
    const logs = await blockchain.getChildAuditLogs(req.params.childId);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

router.post('/child/:childId/access', authenticate, async (req, res, next) => {
  try {
    const { granteeAddress, level, durationSeconds } = req.body;
    const hash = await blockchain.grantAccess(req.params.childId, granteeAddress, level, durationSeconds);
    res.json({ success: true, data: { txHash: hash } });
  } catch (err) { next(err); }
});

router.get('/verify/:recordId', async (req, res, next) => {
  try {
    const { ipfsHash } = req.query;
    const valid = await blockchain.verifyRecord(req.params.recordId, ipfsHash);
    res.json({ success: true, data: { valid } });
  } catch (err) { next(err); }
});

module.exports = router;
