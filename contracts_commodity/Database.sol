// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Data_Types.sol";

contract Database {
    string public DELIVERED = "Delivered";
    string public CANCELLED = "Cancelled";
    string public IN_TRANSIT = "In Transit";
    string public TOKEN_ISSUED = "Token Issued";

    string public BUY = "Buy";
    string public REFUND = "Refund";

    string public PAID = "Paid";
    string public OUTSTANDING = "Outstanding";

    uint256 public escrow_amount = 0;
    address public owner;

    // Constructor
    constructor(){
        owner = msg.sender;
    }

    // Private data
    mapping(address => Data_Types.User) public user_list;
    mapping(address => Data_Types.User_Address[]) public user_addresses;
    Data_Types.Product[] public product_list;
    // product_id -> index in product_list
    mapping(uint256 => uint256) public product_mapping;
    // Buyer Address => Order-list
    mapping(address => Data_Types.Order[]) public order_list;
    mapping(address => Data_Types.Transaction[]) public order_transaction_list;
    // Need to check if this is needed or not.

    // events
    event UserRegistered(address userAddress, string username);
    event ProductRegistered(uint256 product_id);
    event ProductEdited(uint256 product_id);
    event ProductDeleted(uint256 product_id);
    event OrderPlaced(address user_address,uint256 order_id);
    event OrderCancelled(address user_address,uint256 order_id);
    event OrderDelivered(address user_address,uint256 order_id);
    event addressAdded(address user_address);
    event addressEdited(address user_address);

    // Public functions accessible from the implementation contract
    function addUser(Data_Types.User memory newUser) public {
        user_list[newUser.user_address] = newUser;
        emit UserRegistered(newUser.user_address, newUser.name);
    }

    function addProduct(Data_Types.Product memory newProduct) public {
        product_list.push(newProduct);
        // This could lead to errors while scaling.
        product_mapping[newProduct.product_id] = product_list.length;
        emit ProductRegistered(newProduct.product_id);
    }

    function editProduct(Data_Types.Product memory newProduct, uint256 id) public {
        product_list[  product_mapping[id] - 1] = newProduct;
        emit ProductEdited(newProduct.product_id);
    }

    function deleteProduct(uint256 id) public {
        product_mapping[id] = 0;
        emit ProductDeleted(id);
    }

    function placeOrder(Data_Types.Order memory newOrder,address id) public {
        order_list[id].push(newOrder) ;
        emit OrderPlaced(newOrder.buyer_id,newOrder.order_id);
    }

    function addTransaction(Data_Types.Transaction memory transaction,address id) public {
        order_transaction_list[id].push(transaction) ;
    }

    function cancelOrder(address buyer_id,uint256 index) public {
        order_list[buyer_id][index].order_status = CANCELLED;
        emit OrderCancelled(buyer_id,order_list[buyer_id][index].order_id);
    }

    function markAsDelivered(address buyer_id,uint256 index) public {
        order_list[buyer_id][index].order_status = CANCELLED;
        // Change status of Transaction to Paid.
        emit OrderDelivered(buyer_id,order_list[buyer_id][index].order_id);
    }

    function markTransactionAsPaid(address buyer_id, uint256 index) public{
        order_transaction_list[buyer_id][index].status = PAID;
    }

    function listProducts(
        uint256 lotSize,
        uint256 pageNumber
    ) public view returns (Data_Types.Product[] memory) {
        uint256 startIndex = lotSize * (pageNumber - 1);
        uint256 endIndex = startIndex + (lotSize - 1);
        if (endIndex > product_list.length) {
            endIndex = product_list.length - 1;
        }
        Data_Types.Product[] memory currentProducts = new Data_Types.Product[](
            endIndex - startIndex + 1
        );
        for (uint256 i = startIndex; i <= endIndex; i++) {
            currentProducts[i - startIndex] = product_list[i];
        }
        return currentProducts;
    }

    function addAddress(
        Data_Types.User_Address memory newAddress,
        address user_address
    ) public {
        user_addresses[user_address].push(newAddress);
        emit addressAdded(user_address);
    }

    function editAddress(
        Data_Types.User_Address memory newAddress,
        address user_address,
        uint256 id
    ) public {
        for (uint256 i = 0; i < user_addresses[user_address].length; i++) {
            if (user_addresses[user_address][i].addr_id == id) {
                user_addresses[user_address][i] = newAddress;
            }
        }
        emit addressEdited(user_address);
    }
}
