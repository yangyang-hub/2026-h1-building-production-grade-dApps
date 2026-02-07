// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradeableBoxV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;
    uint256 public unchanged;

    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 initialValue, uint256 unchangedValue) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        value = initialValue;
        unchanged = unchangedValue;
    }

    function setValue(uint256 newValue) external {
        value = newValue;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
