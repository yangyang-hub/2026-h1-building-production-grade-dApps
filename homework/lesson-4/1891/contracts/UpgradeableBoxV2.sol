// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {UpgradeableBoxV1} from "./UpgradeableBoxV1.sol";

contract UpgradeableBoxV2 is UpgradeableBoxV1 {
    uint256 public version;

    function initializeV2() external reinitializer(2) {
        version = 2;
    }

    function setValueV2(uint256 newValue) external {
        value = newValue;
        version = 2;
    }
}
