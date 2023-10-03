// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Database{

    struct User_Address{
        string addr;
        string contact_number;
    }

    struct User{
        string name;
        User_Address[] address_list;
    }

    struct Product {
        uint256 product_id;
        string product_name;
        uint256 price;
        uint256 stock;
        uint max_limit_per_purchase;
        uint delivery_charges;
        address owner_id;
        string[] tags;
    }

    struct Transaction {
        string transaction_type; //[Buy,Refund]
        uint256 transaction_id;
        uint256 amount;
        uint256 delivery_charges;
        uint256 platform_fee;
        uint256 convinience_fee;
        uint256 token_charges; // Need to figure out how to put them in the DB.
    }

    struct Order {
        uint256 order_id;
        string order_status; // [Delivered, Cancelled, In Transit, Token Issued]
        uint256 product_id;
        uint256 quantity;
        address buyer_id;
        Transaction[] payment_detail;
    }

    // Private data
    mapping (address => User) private user_list;
    mapping (uint => Product) private product_list;
    mapping (uint => Order)  private order_list;

    

}