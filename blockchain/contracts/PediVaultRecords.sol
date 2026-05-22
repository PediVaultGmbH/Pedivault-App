// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PediVaultRecords is Ownable, Pausable {
    struct Record {
        string  ipfsHash;
        string  recordType;
        string  childId;
        uint256 timestamp;
        address uploadedBy;
        bool    isValid;
    }

    mapping(bytes32 => Record) private records;
    mapping(string => bytes32[]) private childRecords;
    mapping(address => bool) public authorizedUploaders;

    event RecordAdded(bytes32 indexed recordId, string indexed childId, string ipfsHash, string recordType, uint256 timestamp);
    event RecordRevoked(bytes32 indexed recordId, uint256 timestamp);

    modifier onlyAuthorized() {
        require(authorizedUploaders[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        authorizedUploaders[msg.sender] = true;
    }

    function authorizeUploader(address uploader) external onlyOwner {
        authorizedUploaders[uploader] = true;
    }

    function addRecord(string calldata childId, string calldata ipfsHash, string calldata recordType) external onlyAuthorized whenNotPaused returns (bytes32) {
        require(bytes(childId).length > 0, "Child ID required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        bytes32 recordId = keccak256(abi.encodePacked(childId, ipfsHash, block.timestamp, msg.sender));
        records[recordId] = Record({ ipfsHash: ipfsHash, recordType: recordType, childId: childId, timestamp: block.timestamp, uploadedBy: msg.sender, isValid: true });
        childRecords[childId].push(recordId);
        emit RecordAdded(recordId, childId, ipfsHash, recordType, block.timestamp);
        return recordId;
    }

    function getRecord(bytes32 recordId) external view returns (Record memory) {
        require(records[recordId].timestamp > 0, "Record not found");
        return records[recordId];
    }

    function getChildRecords(string calldata childId) external view returns (bytes32[] memory) {
        return childRecords[childId];
    }

    function verifyRecord(bytes32 recordId, string calldata ipfsHash) external view returns (bool) {
        Record memory r = records[recordId];
        return r.isValid && keccak256(bytes(r.ipfsHash)) == keccak256(bytes(ipfsHash));
    }

    function revokeRecord(bytes32 recordId) external onlyAuthorized {
        records[recordId].isValid = false;
        emit RecordRevoked(recordId, block.timestamp);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
