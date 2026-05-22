// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract PediVaultVaccine is Ownable, Pausable {
    struct VaccineCert {
        string  childId;
        string  vaccineName;
        string  dose;
        string  batchNumber;
        string  doctor;
        uint256 dateAdministered;
        uint256 issuedAt;
        address issuedBy;
        bool    isValid;
    }

    mapping(bytes32 => VaccineCert) private certificates;
    mapping(string => bytes32[]) private childCertificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateIssued(bytes32 indexed certId, string indexed childId, string vaccineName, string dose, uint256 dateAdministered);
    event CertificateRevoked(bytes32 indexed certId, uint256 timestamp);

    modifier onlyAuthorized() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        authorizedIssuers[msg.sender] = true;
    }

    function authorizeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
    }

    function issueCertificate(string calldata childId, string calldata vaccineName, string calldata dose, string calldata batchNumber, string calldata doctor, uint256 dateAdministered) external onlyAuthorized whenNotPaused returns (bytes32) {
        bytes32 certId = keccak256(abi.encodePacked(childId, vaccineName, dose, dateAdministered, block.timestamp, msg.sender));
        certificates[certId] = VaccineCert({ childId: childId, vaccineName: vaccineName, dose: dose, batchNumber: batchNumber, doctor: doctor, dateAdministered: dateAdministered, issuedAt: block.timestamp, issuedBy: msg.sender, isValid: true });
        childCertificates[childId].push(certId);
        emit CertificateIssued(certId, childId, vaccineName, dose, dateAdministered);
        return certId;
    }

    function getCertificate(bytes32 certId) external view returns (VaccineCert memory) {
        require(certificates[certId].issuedAt > 0, "Certificate not found");
        return certificates[certId];
    }

    function getChildCertificates(string calldata childId) external view returns (bytes32[] memory) {
        return childCertificates[childId];
    }

    function verifyCertificate(bytes32 certId) external view returns (bool) {
        return certificates[certId].isValid && certificates[certId].issuedAt > 0;
    }

    function revokeCertificate(bytes32 certId) external onlyAuthorized {
        certificates[certId].isValid = false;
        emit CertificateRevoked(certId, block.timestamp);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
