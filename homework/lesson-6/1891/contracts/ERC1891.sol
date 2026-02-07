// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC1891 is ERC20 {
    constructor() ERC20("ERC1891", "E1891") {
        _mint(msg.sender, 1_000_000 ether);
    }
}
