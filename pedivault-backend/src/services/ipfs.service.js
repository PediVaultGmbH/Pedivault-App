const PinataClient = require('@pinata/sdk');
const { Readable } = require('stream');

class IPFSService {
  constructor() {
    this.client  = null;
    this.enabled = false;
    this.init();
  }

  init() {
    try {
      const apiKey    = process.env.PINATA_API_KEY;
      const secretKey = process.env.PINATA_SECRET_KEY;

      if (!apiKey || !secretKey) {
        console.log('[IPFS] No Pinata keys set — IPFS features disabled');
        return;
      }

      this.client  = new PinataClient(apiKey, secretKey);
      this.enabled = true;
      console.log('[IPFS] ✅ Connected to Pinata');
    } catch (err) {
      console.error('[IPFS] Init failed:', err.message);
    }
  }

  async uploadJSON(data, name) {
    if (!this.enabled) return null;
    try {
      const result = await this.client.pinJSONToIPFS(data, {
        pinataMetadata: { name: name || 'PediVault Record' },
      });
      console.log('[IPFS] JSON uploaded:', result.IpfsHash);
      return result.IpfsHash;
    } catch (err) {
      console.error('[IPFS] uploadJSON failed:', err.message);
      return null;
    }
  }

  async uploadFile(buffer, fileName, mimeType) {
    if (!this.enabled) return null;
    try {
      const stream = Readable.from(buffer);
      stream.path  = fileName;
      const result = await this.client.pinFileToIPFS(stream, {
        pinataMetadata: { name: fileName },
        pinataOptions:  { cidVersion: 1 },
      });
      console.log('[IPFS] File uploaded:', result.IpfsHash);
      return result.IpfsHash;
    } catch (err) {
      console.error('[IPFS] uploadFile failed:', err.message);
      return null;
    }
  }

  getGatewayUrl(hash) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  async testConnection() {
    if (!this.enabled) return false;
    try {
      await this.client.testAuthentication();
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = new IPFSService();
