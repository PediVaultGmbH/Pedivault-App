const { ethers } = require('ethers');

// Contract ABIs (minimal - only functions we need)
const RECORDS_ABI = [
  "function addRecord(string childId, string ipfsHash, string recordType) returns (bytes32)",
  "function getRecord(bytes32 recordId) view returns (tuple(string ipfsHash, string recordType, string childId, uint256 timestamp, address uploadedBy, bool isValid))",
  "function getChildRecords(string childId) view returns (bytes32[])",
  "function verifyRecord(bytes32 recordId, string ipfsHash) view returns (bool)",
  "function revokeRecord(bytes32 recordId)",
];

const VACCINE_ABI = [
  "function issueCertificate(string childId, string vaccineName, string dose, string batchNumber, string doctor, uint256 dateAdministered) returns (bytes32)",
  "function getCertificate(bytes32 certId) view returns (tuple(string childId, string vaccineName, string dose, string batchNumber, string doctor, uint256 dateAdministered, uint256 issuedAt, address issuedBy, bool isValid))",
  "function getChildCertificates(string childId) view returns (bytes32[])",
  "function verifyCertificate(bytes32 certId) view returns (bool)",
];

const AUDIT_ABI = [
  "function log(string childId, string resourceType, string resourceId, uint8 action, string metadata) returns (uint256)",
  "function getLog(uint256 logIndex) view returns (tuple(string childId, string resourceType, string resourceId, uint8 action, address performedBy, uint256 timestamp, string metadata))",
  "function getChildLogs(string childId) view returns (uint256[])",
  "function getTotalLogs() view returns (uint256)",
];

const ACCESS_ABI = [
  "function registerChild(string childId)",
  "function grantAccess(string childId, address grantee, uint8 level, uint256 durationSeconds)",
  "function revokeAccess(string childId, address grantee)",
  "function checkAccess(string childId, address grantee) view returns (uint8)",
  "function childOwners(string childId) view returns (address)",
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet   = null;
    this.contracts = {};
    this.enabled = false;
    this.init();
  }

  init() {
    try {
      const rpc        = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
      const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

      if (!privateKey) {
        console.log('[Blockchain] No private key set — blockchain features disabled');
        return;
      }

      this.provider = new ethers.JsonRpcProvider(rpc);
      this.wallet   = new ethers.Wallet(privateKey, this.provider);

      const recordsAddr = process.env.RECORDS_CONTRACT;
      const vaccineAddr = process.env.VACCINE_CONTRACT;
      const auditAddr   = process.env.AUDIT_CONTRACT;
      const accessAddr  = process.env.ACCESS_CONTRACT;

      if (!recordsAddr || !vaccineAddr || !auditAddr || !accessAddr) {
        console.log('[Blockchain] Contract addresses missing — blockchain features disabled');
        return;
      }

      this.contracts.records = new ethers.Contract(recordsAddr, RECORDS_ABI, this.wallet);
      this.contracts.vaccine = new ethers.Contract(vaccineAddr, VACCINE_ABI, this.wallet);
      this.contracts.audit   = new ethers.Contract(auditAddr,   AUDIT_ABI,   this.wallet);
      this.contracts.access  = new ethers.Contract(accessAddr,  ACCESS_ABI,  this.wallet);

      this.enabled = true;
      console.log('[Blockchain] ✅ Connected to Polygon Amoy');
    } catch (err) {
      console.error('[Blockchain] Init failed:', err.message);
    }
  }

  // ── Records ────────────────────────────────────────────────────────────────
  async addRecord(childId, ipfsHash, recordType) {
    if (!this.enabled) return null;
    try {
      const tx = await this.contracts.records.addRecord(childId, ipfsHash, recordType);
      const receipt = await tx.wait();
      console.log('[Blockchain] Record added:', receipt.hash);
      return receipt.hash;
    } catch (err) {
      console.error('[Blockchain] addRecord failed:', err.message);
      return null;
    }
  }

  async getChildRecords(childId) {
    if (!this.enabled) return [];
    try {
      return await this.contracts.records.getChildRecords(childId);
    } catch (err) {
      console.error('[Blockchain] getChildRecords failed:', err.message);
      return [];
    }
  }

  async verifyRecord(recordId, ipfsHash) {
    if (!this.enabled) return false;
    try {
      return await this.contracts.records.verifyRecord(recordId, ipfsHash);
    } catch (err) {
      console.error('[Blockchain] verifyRecord failed:', err.message);
      return false;
    }
  }

  // ── Vaccine Certificates ───────────────────────────────────────────────────
  async issueCertificate(childId, vaccineName, dose, batchNumber, doctor, dateAdministered) {
    if (!this.enabled) return null;
    try {
      const timestamp = Math.floor(new Date(dateAdministered).getTime() / 1000);
      const tx = await this.contracts.vaccine.issueCertificate(
        childId, vaccineName, dose, batchNumber || '', doctor || '', timestamp
      );
      const receipt = await tx.wait();
      console.log('[Blockchain] Certificate issued:', receipt.hash);
      return receipt.hash;
    } catch (err) {
      console.error('[Blockchain] issueCertificate failed:', err.message);
      return null;
    }
  }

  async getChildCertificates(childId) {
    if (!this.enabled) return [];
    try {
      return await this.contracts.vaccine.getChildCertificates(childId);
    } catch (err) {
      console.error('[Blockchain] getChildCertificates failed:', err.message);
      return [];
    }
  }

  // ── Audit Trail ────────────────────────────────────────────────────────────
  // ActionType: 0=VIEW, 1=CREATE, 2=UPDATE, 3=DELETE, 4=SHARE, 5=REVOKE
  async logAction(childId, resourceType, resourceId, action, metadata = '') {
    if (!this.enabled) return null;
    try {
      const tx = await this.contracts.audit.log(childId, resourceType, resourceId, action, metadata);
      const receipt = await tx.wait();
      console.log('[Blockchain] Audit logged:', receipt.hash);
      return receipt.hash;
    } catch (err) {
      console.error('[Blockchain] logAction failed:', err.message);
      return null;
    }
  }

  async getChildAuditLogs(childId) {
    if (!this.enabled) return [];
    try {
      return await this.contracts.audit.getChildLogs(childId);
    } catch (err) {
      console.error('[Blockchain] getChildAuditLogs failed:', err.message);
      return [];
    }
  }

  // ── Access Control ─────────────────────────────────────────────────────────
  async registerChild(childId) {
    if (!this.enabled) return null;
    try {
      const tx = await this.contracts.access.registerChild(childId);
      const receipt = await tx.wait();
      console.log('[Blockchain] Child registered:', receipt.hash);
      return receipt.hash;
    } catch (err) {
      console.error('[Blockchain] registerChild failed:', err.message);
      return null;
    }
  }

  async grantAccess(childId, granteeAddress, level, durationSeconds = 0) {
    if (!this.enabled) return null;
    try {
      const tx = await this.contracts.access.grantAccess(childId, granteeAddress, level, durationSeconds);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (err) {
      console.error('[Blockchain] grantAccess failed:', err.message);
      return null;
    }
  }

  async checkAccess(childId, granteeAddress) {
    if (!this.enabled) return 0;
    try {
      return await this.contracts.access.checkAccess(childId, granteeAddress);
    } catch (err) {
      console.error('[Blockchain] checkAccess failed:', err.message);
      return 0;
    }
  }
}

module.exports = new BlockchainService();
