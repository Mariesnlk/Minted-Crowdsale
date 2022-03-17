// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20Mintable.sol";

contract MyToken is ERC20Mintable {
    // constructor(uint256 initialSupply)
    constructor() ERC20Mintable("Mariia Synelnyk", "MSNLK") {}

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
