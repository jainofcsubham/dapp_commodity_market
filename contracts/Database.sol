// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Data_Types.sol";

contract Database{



    // Private data
    mapping (address => Data_Types.User) private user_list;
    mapping (uint => Data_Types.Product) private product_list;
    mapping (uint => Data_Types.Order)  private order_list;
    // Need to check if this is needed or not.
    mapping (uint => Data_Types.Transaction) private transaction_list;

    // Public functions accessible from the implementation contract

    function addUser() public {
        // Adds the user
    }

    function addProduct() public {

    }

    function placeOrder() public {

    }

    function cancelOrder() public {

    }

    function markAsDelivered() public {
    }

    function listProducts() public {

    }

    function addAddress() public {

    }

    function editAddress() public {

    }

}