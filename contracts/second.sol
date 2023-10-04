// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;



import "./first.sol";
contract Second is First {
    address private owner;
    // First instance ;

    constructor(){
        owner = msg.sender;
        // instance = new First();
    }

    mapping (uint => Book) abc;

    function doProcess (uint num) public pure returns (uint) {
        return calculateSquare(num);

    }
}