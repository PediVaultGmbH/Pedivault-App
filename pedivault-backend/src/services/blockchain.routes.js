const router = require('express').Router();
const blockchain = require('./blockchain.service');
const { authenticate } = require('../middleware/auth');
const { ethers } = require('ethers');

router.get('/status', authenticate, async (req, res) => {
  try {
    let balance = null;
    if (blockchain.enabled && blockchain.wallet) {
      const raw = await blockchain.wallet.provider.getBalance(blockchain.wallet.address);
      balance = parseFloat(ethers.formatEther(raw)).toFixed(4);
    }
    res.json({ success: true, data: { enabled: blockchain.enabled, balance, address: blockchain.wallet?.address || null } });
  } catch (err) {
    res.json({ success: true, data: { enabled: blockchain.enabled, balance: null } });
  }
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
