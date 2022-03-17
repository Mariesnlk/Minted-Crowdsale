// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCContract is Ownable {
    mapping(address => bool) private allowed;

    function setKYCCompleted(address _address) public onlyOwner {
        allowed[_address] = true;
    }

    function setKYCRevoked(address _address) public onlyOwner {
        allowed[_address] = false;
    }

    function kycCompleted(address _address) public view returns(bool){
        return allowed[_address];
    }
}
