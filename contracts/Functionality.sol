// SPDX-License-Identifier: MIT
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
pragma solidity ^0.8.9;

import "./Database.sol";
import "./guard.sol";

contract Functionality is Database{
    bool internal locked;
    modifier reentrancyGuard() {
        require(!locked);
        locked = true;
        _;
        locked = false;
    }
    // Modifiers

    modifier validateUser(address addr) {
        require(
            bytes(user_list[addr].name).length > 0,
            "User doesn't exist. Please register."
        );
        _;
    }

    function registerUser(
        string memory name,
        string memory addr,
        string memory contact_number
    ) public returns (bool) {
        // Validation
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(addr).length > 0, "Address cannot be empty");
        require(
            bytes(contact_number).length > 0,
            "Contact number cannot be empty"
        );
        Data_Types.User memory user = user_list[msg.sender];
        require(bytes(user.name).length == 0, "User already registered.");

        // Adding User
        user.name = name;
        user.user_address = msg.sender;
        addUser(user);
        Data_Types.User_Address memory newUserAddress = Data_Types
            .User_Address({
                addr_id: user_addresses[msg.sender].length,
                addr: addr,
                contact_number: contact_number
            });
        user_addresses[msg.sender].push(newUserAddress);
        return true;
    }

    function loginUser() public view validateUser(msg.sender) returns (bool) {
        return true;
    }

    function getProducts(
        uint256 lotSize,
        uint256 pageNumber
    )
        public
        view
        validateUser(msg.sender)
        returns (Data_Types.Product[] memory)
    {
        uint256 startIndex = lotSize * (pageNumber - 1);
        require(startIndex < product_list.length, "Invalid Page Number");
        return listProducts(lotSize, pageNumber);
    }

    function addContactDetails(
        string memory addr,
        string memory contact_number
    ) public validateUser(msg.sender) {
        require(bytes(addr).length > 0, "Address cannot be empty");
        require(
            bytes(contact_number).length > 0,
            "Contact Number cannot be empty"
        );
        Data_Types.User_Address memory curr_Addr = Data_Types.User_Address({
            addr_id: user_addresses[msg.sender].length + 1,
            addr: addr,
            contact_number: contact_number
        });
        addAddress(curr_Addr, msg.sender);
    }

    function modifyContactDetails(
        string memory addr,
        string memory contact_number,
        uint256 id
    ) public validateUser(msg.sender) {
        require(bytes(addr).length > 0, "Address cannot be empty");
        require(
            bytes(contact_number).length > 0,
            "Contact Number cannot be empty"
        );
        require(user_addresses[msg.sender].length > id && id > 0, "Invalid ID");
        Data_Types.User_Address memory curr_Addr = Data_Types.User_Address({
            addr_id: id,
            addr: addr,
            contact_number: contact_number
        });
        editAddress(curr_Addr, msg.sender, id);
    }

    function listProduct(
        uint256 product_id,
        string memory product_name,
        uint256 price,
        uint256 stock,
        uint256 max_limit_per_purchase,
        uint256 delivery_charges,
        string[5] memory tags
    ) public validateUser(msg.sender) {
        require(product_id > 0, "Invalid Product ID");
        require(bytes(product_name).length > 0, "Invalid Product Name");
        require(price > 0, "Invalid Price");
        require(stock > 0, "Invalid Stock");
        require(
            max_limit_per_purchase > 0 && max_limit_per_purchase < 5,
            "Invalid Limit"
        );
        // require()
        require(product_mapping[product_id] == 0, "Product Already Exists.");

        Data_Types.Product memory product = Data_Types.Product({
            product_id: product_id,
            product_name: product_name,
            price: price,
            stock: stock,
            max_limit_per_purchase: max_limit_per_purchase,
            delivery_charges: delivery_charges,
            tags: tags,
            owner_id: msg.sender
        });
        addProduct(product);
    }

    function modifyListedProduct(
        uint256 product_id,
        string memory product_name,
        uint256 price,
        uint256 stock,
        uint256 max_limit_per_purchase,
        uint256 delivery_charges,
        string[5] memory tags
    ) public validateUser(msg.sender) {
        require(product_id > 0, "Invalid Product ID");
        require(bytes(product_name).length > 0, "Invalid Product Name");
        require(price > 0, "Invalid Price");
        require(stock > 0, "Invalid Stock");
        require(
            max_limit_per_purchase > 0 && max_limit_per_purchase < 5,
            "Invalid Limit"
        );
        require(product_mapping[product_id] != 0, "Product doesn't exist.");
        Data_Types.Product memory product = Data_Types.Product({
            product_id: product_id,
            product_name: product_name,
            price: price,
            stock: stock,
            max_limit_per_purchase: max_limit_per_purchase,
            delivery_charges: delivery_charges,
            tags: tags,
            owner_id: msg.sender
        });
        editProduct(product, product_id);
    }

    function deleteProductFromListing(
        uint256 product_id
    ) public validateUser(msg.sender) {
        deleteProduct(product_id);
    }

    function buyProduct(
        uint256 product_id,
        uint256 quantity
    ) external payable validateUser(msg.sender) {
        require(product_mapping[product_id] != 0, "Product doesn't exist");
        require(
            quantity <=
                product_list[product_mapping[product_id] - 1]
                    .max_limit_per_purchase,
            "Cannot buy the mentioned quantity."
        );
        require(
            quantity <= product_list[product_mapping[product_id] - 1].stock,
            "Cannot buy the mentioned quantity."
        );
        require(
            msg.sender !=
                product_list[product_mapping[product_id] - 1].owner_id,
            "Seller can't buy the product."
        );
        require(
            msg.value ==
                product_list[product_mapping[product_id] - 1].delivery_charges +
                    (quantity *
                        product_list[product_mapping[product_id] - 1].price),
            "Invalid amount"
        );
        Data_Types.Order memory order = Data_Types.Order({
            product_id: product_id,
            quantity: quantity,
            order_status: IN_TRANSIT,
            order_id: order_list[msg.sender].length + 1,
            buyer_id: msg.sender
        });
        // Order added
        placeOrder(order, msg.sender);
        // Transfer Money to Escrow
        escrow_amount += msg.value;
        Data_Types.Transaction memory transaction = Data_Types.Transaction({
            transaction_type: BUY,
            transaction_id: order_transaction_list[msg.sender].length + 1,
            amount: product_list[product_mapping[product_id] - 1]
                .delivery_charges +
                (quantity *
                    product_list[product_mapping[product_id] - 1].price),
            status: OUTSTANDING,
            delivery_charges: product_list[product_mapping[product_id] - 1]
                .delivery_charges,
            platform_fee: 0,
            convinience_fee: 0,
            token_charges: 0,
            order_id: order_list[msg.sender].length
        });
        addTransaction(transaction, msg.sender);
    }

    function deliverProduct(
        address buyer_id,
        uint256 order_id
    // ) external validateUser(msg.sender) nonReentrant {
    ) external validateUser(msg.sender)  {
        // // Mark as Delivered
        require(order_list[buyer_id].length > 0, "Invalid Order ID");
        uint256 index = 0;
        uint256 flag = 0;
        for (uint256 i = 0; i < order_list[buyer_id].length; i++) {
            if (order_list[buyer_id][i].order_id == order_id) {
                index = i;
                flag = 1;
            }
        }
        require(flag == 1, "No such order found");
        Data_Types.Order memory order = order_list[buyer_id][index];
        Data_Types.Product memory product = product_list[
            uint256(product_mapping[order.product_id]) - 1
        ];
        require(
            msg.sender == product.owner_id,
            "You are not authorized to mark this as delivered."
        );
        require(
            keccak256(abi.encodePacked(order.order_status)) ==
                keccak256(abi.encodePacked(IN_TRANSIT)),
            "This action is not permitted"
        );
        uint256 transactionIndex = 0;
        uint256 found = 0;
        for (uint256 i = 0; i < order_transaction_list[buyer_id].length; i++) {
            if (
                order_transaction_list[buyer_id][i].order_id == order_id &&
                keccak256(
                    abi.encodePacked(
                        order_transaction_list[buyer_id][i].transaction_type
                    )
                ) ==
                keccak256(abi.encodePacked(BUY)) &&
                keccak256(
                    abi.encodePacked(order_transaction_list[buyer_id][i].status)
                ) ==
                keccak256(abi.encodePacked(OUTSTANDING))
            ) {
                transactionIndex = i;
                found = 1;
            }
        }
        require(found != 0, "No valid transaction found.");
        uint256 amountToTransfer = (order.quantity * product.price) +
            product.delivery_charges;
        address payable seller = payable(msg.sender);
        escrow_amount -= amountToTransfer;
        seller.transfer(amountToTransfer);
        markAsDelivered(buyer_id, index);
        markTransactionAsPaid(buyer_id, transactionIndex);
    }

    function cancelShipment() public validateUser(msg.sender) {
        // Mark order as cancelled
        // Create a refund transaction
        // Chnage status of Buy transaction to Paid
        // Send money to buyer
    }

    function burnTokensAndInitiateShipment() public validateUser(msg.sender) {
        // This we can do something
    }
}
