// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract First {

    struct Book {
        uint book_id;
    }

    function calculateSquare (uint num) public pure returns (uint) {
        require(num <= 10,"Number should be less than or equal to 10.");
        return num*num;
    }
}