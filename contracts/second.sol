// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;



import "./first.sol";
contract Second {
    address private owner;
    First instance ;
    constructor(){
        owner = msg.sender;
        instance = new First();
    }

    function doProcess (uint num) public view returns (uint) {
        return instance.calculateSquare(num);
    }
}