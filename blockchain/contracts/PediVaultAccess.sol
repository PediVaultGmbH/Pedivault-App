// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PediVaultAccess is Ownable {
    enum AccessLevel { NONE, READ, READ_WRITE, FULL }

    struct AccessGrant {
        address     grantee;
        string      childId;
        AccessLevel level;
        uint256     grantedAt;
        uint256     expiresAt;
        bool        isActive;
    }

    mapping(string => address) public childOwners;
    mapping(string => mapping(address => AccessGrant)) private accessGrants;
    mapping(string => address[]) private childGrantees;

    event OwnershipRegistered(string indexed childId, address indexed owner);
    event AccessGranted(string indexed childId, address indexed grantee, AccessLevel level, uint256 expiresAt);
    event AccessRevoked(string indexed childId, address indexed grantee);

    modifier onlyChildOwner(string calldata childId) {
        require(childOwners[childId] == msg.sender || msg.sender == owner(), "Not child owner");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function registerChild(string calldata childId) external {
        require(childOwners[childId] == address(0), "Child already registered");
        childOwners[childId] = msg.sender;
        emit OwnershipRegistered(childId, msg.sender);
    }

    function grantAccess(string calldata childId, address grantee, AccessLevel level, uint256 durationSeconds) external onlyChildOwner(childId) {
        uint256 expiresAt = durationSeconds > 0 ? block.timestamp + durationSeconds : type(uint256).max;
        accessGrants[childId][grantee] = AccessGrant({ grantee: grantee, childId: childId, level: level, grantedAt: block.timestamp, expiresAt: expiresAt, isActive: true });
        childGrantees[childId].push(grantee);
        emit AccessGranted(childId, grantee, level, expiresAt);
    }

    function revokeAccess(string calldata childId, address grantee) external onlyChildOwner(childId) {
        accessGrants[childId][grantee].isActive = false;
        emit AccessRevoked(childId, grantee);
    }

    function checkAccess(string calldata childId, address grantee) external view returns (AccessLevel) {
        if (childOwners[childId] == grantee) return AccessLevel.FULL;
        AccessGrant memory grant = accessGrants[childId][grantee];
        if (!grant.isActive || block.timestamp > grant.expiresAt) return AccessLevel.NONE;
        return grant.level;
    }

    function getChildGrantees(string calldata childId) external view returns (address[] memory) {
        return childGrantees[childId];
    }
}
