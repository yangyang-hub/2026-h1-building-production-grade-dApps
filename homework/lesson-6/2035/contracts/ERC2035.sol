// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ERC2035
 * @notice Simple smart contract for Lesson 6 homework
 * @dev Stores and retrieves a uint256 value
 */
contract ERC2035 {
    uint256 private value;
    
    event ValueChanged(uint256 indexed newValue, address indexed changedBy);
    
    /**
     * @notice Set a new value
     * @param newValue The value to store
     */
    function setValue(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue, msg.sender);
    }
    
    /**
     * @notice Get the current stored value
     * @return The stored value
     */
    function getValue() public view returns (uint256) {
        return value;
    }
}
