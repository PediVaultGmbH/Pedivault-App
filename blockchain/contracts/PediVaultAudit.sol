// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PediVaultAudit is Ownable {
    enum ActionType { VIEW, CREATE, UPDATE, DELETE, SHARE, REVOKE }

    struct AuditLog {
        string     childId;
        string     resourceType;
        string     resourceId;
        ActionType action;
        address    performedBy;
        uint256    timestamp;
        string     metadata;
    }

    AuditLog[] private logs;
    mapping(string => uint256[]) private childLogs;
    mapping(address => bool) public authorizedLoggers;

    event AuditLogged(uint256 indexed logIndex, string indexed childId, ActionType action, address performedBy, uint256 timestamp);

    modifier onlyAuthorized() {
        require(authorizedLoggers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        authorizedLoggers[msg.sender] = true;
    }

    function authorizeLogger(address logger) external onlyOwner {
        authorizedLoggers[logger] = true;
    }

    function log(string calldata childId, string calldata resourceType, string calldata resourceId, ActionType action, string calldata metadata) external onlyAuthorized returns (uint256) {
        uint256 logIndex = logs.length;
        logs.push(AuditLog({ childId: childId, resourceType: resourceType, resourceId: resourceId, action: action, performedBy: msg.sender, timestamp: block.timestamp, metadata: metadata }));
        childLogs[childId].push(logIndex);
        emit AuditLogged(logIndex, childId, action, msg.sender, block.timestamp);
        return logIndex;
    }

    function getLog(uint256 logIndex) external view returns (AuditLog memory) {
        require(logIndex < logs.length, "Log not found");
        return logs[logIndex];
    }

    function getChildLogs(string calldata childId) external view returns (uint256[] memory) {
        return childLogs[childId];
    }

    function getTotalLogs() external view returns (uint256) {
        return logs.length;
    }
}
