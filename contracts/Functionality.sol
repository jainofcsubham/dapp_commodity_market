// SPDX-License-Identifier: MIT
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
pragma solidity ^0.8.9;
import "hardhat/console.sol";

import "./Database.sol";
import "./guard.sol";

contract Functionality is Database {
    bool internal locked;
    modifier reentrancyGuard() {
        require(!locked);
        locked = true;
        _;
        locked = false;
    }

    // Utility function 

    function ceil(uint256 numerator, uint256 denominator) public pure returns (uint256) {
        return (numerator + denominator - 1) / denominator;
    }

    // Third party functions 
    function validateProjectCredits() private pure returns (bool){
        return true;
    }

    function getCreditPrice () private pure returns (uint256) {
        return 100;
    }

    // Modifiers

    modifier validateUser(address addr) {
        require(
            bytes(user_list[addr].first_name).length > 0,
            "User doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrg(address addr) {
        require(
            bytes(organization_list[addr].name).length > 0,
            "Organization doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrgOrUser(address addr) {
        require(
            bytes(user_list[addr].first_name).length > 0 || bytes(organization_list[addr].name).length > 0,
            "Invalid Login!! Please register."
        );
        _;
    }

    function registerUser(
        Data_Types.RegisterUserType memory args
    ) public returns (bool) {
        // Validation
        require(
            bytes(args.first_name).length > 0,
            "First Name cannot be empty"
        );
        require(bytes(args.last_name).length > 0, "Last Name cannot be empty");
        require(bytes(args.email).length > 0, "Email cannot be empty");
        require(bytes(args.gender).length > 0, "Gender cannot be empty");
        require(args.date_of_birth > 0, "DOB cannot be empty");

        // Logic
        Data_Types.User memory user = user_list[msg.sender];
        require(
            bytes(user_list[msg.sender].first_name).length == 0,
            "User already registered."
        );
        user.first_name = args.first_name;
        user.last_name = args.last_name;
        user.email = args.email;
        user.date_of_birth = args.date_of_birth;
        user.gender = args.gender;
        user.user_address = msg.sender;
        addUser(user);
        return true;
    }

    function loginUser()
        public
        view
        validateOrgOrUser(msg.sender)
        returns (bool)
    {
        return true;
    }

    function addEmission(
        Data_Types.AddEmissionType memory args
    ) public validateUser(msg.sender) returns (bool) {
        return addEmissionToList(args.date, args.emissions, msg.sender);
    }

    function fetchEmissions(
        Data_Types.FetchEmissionsType memory args
    ) public validateUser(msg.sender) view returns (Data_Types.DateEmission[10] memory) {
        Data_Types.DateEmission[10] memory emission_history;
        uint256 step = 24 * 3600 * 1000;
        uint256 index = 0;
        for (uint256 i = args.from; i <= args.to; i = i + step) {
            if (!(user_emissions[msg.sender][i].length > 0)) {
                continue;
            }
            Data_Types.DateEmission memory temp;
            temp.date = i;
            temp.emission = user_emissions[msg.sender][i];
            emission_history[index] = temp;
            index = index + 1;
        }
        return emission_history;
    }

    function registerOrganization(
        Data_Types.RegisterOrgType memory args
    ) public returns (bool) {
        // Validation
        require(bytes(args.name).length > 0, "Name cannot be empty");
        require(bytes(args.email).length > 0, "Email cannot be empty");

        // Logic
        Data_Types.Organization memory org = organization_list[msg.sender];
        require(
            bytes(organization_list[msg.sender].name).length == 0,
            "Organization already registered."
        );
        org.name = args.name;
        org.email = args.email;
        org.id = msg.sender;
        addOrganization(org);
        return true;
    }


    function addProject(Data_Types.ProjectType memory args) public validateOrg(msg.sender) returns (bool) {
        require(bytes(args.name).length > 0, "Name cannot be empty");
        require(bytes(args.description).length > 0, "Description cannot be empty.");
        require(bytes(args.creditType).length > 0, "Credit Type must be provided.");
        require(args.creditQuantity > 0, "Credit Quantity must be more than 0.");
        // Verify credits from third party libraries/wallets
        require(validateProjectCredits(),"Credits could not be verified.");
        uint256 project_id = project_id_list.length;
        Data_Types.Project memory project;
        project.name = args.name;
        project.description = args.description;
        project.id = project_id;
        project.org_id = msg.sender;
        project.status = 'ACTIVE';
        project.creditType = args.creditType;
        project.creditQuantity = args.creditQuantity;
        return addProjectToList(project_id,project);
    }

    function editProject(Data_Types.EditProjectType memory args) public validateOrg(msg.sender)  returns (bool) {
        require(bytes(project_list[args.id].name).length > 0,"Project doesn't exist.");
        require(project_list[args.id].org_id == msg.sender,"Project doesn't exist.");
        require(bytes(args.name).length > 0, "Name cannot be empty");
        require(keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("ACTIVE")) || keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("INACTIVE")), "Status is invalid.");
        require(bytes(args.description).length > 0, "Description cannot be empty.");
        require(bytes(args.creditType).length > 0, "Credit Type must be provided.");
        require(args.creditQuantity > 0, "Credit Quantity must be more than 0.");
        require(validateProjectCredits(),"Credits could not be verified.");
        return editProjectFromList(args.id,args.name,args.description,args.status);
    }

    function addProjectToCart(Data_Types.AddProjectToCartType memory args) public validateUser(msg.sender)  returns (bool) {
        require(args.quantity > 0, "Credit Quantity must be more than 0.");
        require(bytes(project_list[args.projectId].name).length > 0 && keccak256(abi.encodePacked(project_list[args.projectId].status)) == keccak256(abi.encodePacked("ACTIVE")),"Invalid Project");
        string memory creditType = project_list[args.projectId].creditType;
        uint256 oldQuantity = user_cart_list[msg.sender][args.projectId].isCartEmpty ? 0 : user_cart_list[msg.sender][args.projectId].creditQuantityInCart;
        require(project_list[args.projectId].creditQuantity >= args.quantity +oldQuantity ,"Cannot add to cart.");
        return addProjectToCartDB(args,creditType);
    }

    function makeCartEmpty(Data_Types.MakeCartEmptyType memory args) public validateUser(msg.sender) returns  (bool) {
        require(args.projectId >= 0,"Please provide Project ID.");
        return makeUserCartEmpty(args.projectId);
    }

    function buyCreditsFromCart() external payable validateUser(msg.sender) returns (bool) {
        uint256 isEmptyCart = 0;
        uint256 inStock = 1;    
        uint256 totalPrice = 0;
        for(uint256 i=0;i<user_cart_id_list[msg.sender].length;i++){
            uint256 projectId = user_cart_id_list[msg.sender][i];
            if(user_cart_list[msg.sender][projectId].creditQuantityInCart > 0){
                isEmptyCart = 1;
                totalPrice = totalPrice + (user_cart_list[msg.sender][projectId].creditQuantityInCart * getCreditPrice() );
            }
            if(project_list[projectId].creditQuantity < user_cart_list[msg.sender][projectId].creditQuantityInCart){
                inStock = 0;
            }

        }
        require(isEmptyCart == 1,"Cart is empty.");
        require(inStock == 1,"Some projects do not have enough credits now. Cannot place buy order.");
        require(totalPrice == msg.value, "Invalid amount");
        transferCredits();
        for(uint256 i=0;i<user_cart_id_list[msg.sender].length;i++){
            uint256 projectId = user_cart_id_list[msg.sender][i];
            address payable orgAddress = payable(project_list[user_cart_id_list[msg.sender][i]].org_id);
            uint256 amount = user_cart_list[msg.sender][projectId].creditQuantityInCart * getCreditPrice() ;
            orgAddress.transfer(amount);
        }

        return true;
    }

    function getPortfolio(uint256 fromIndex) public view validateUser(msg.sender)  returns (Data_Types.CreditDetails[10] memory) {
        require(fromIndex >= 0,"Invalid request"  );
        require(fromIndex <= user_credit_type_list[msg.sender].length,"Invalid request.");
        uint256 startIndex = fromIndex == 0 ? user_credit_type_list[msg.sender].length -1 : fromIndex-1 ;
        Data_Types.CreditDetails[10] memory credits;
        uint256 index =0;
        while(index < 10 && startIndex >= 0){
            credits[index] = user_credit_list[msg.sender][user_credit_type_list[msg.sender][startIndex]];
            startIndex--;
            index++;
        }
        return credits;

    }

    function getTotalCreditCount() public view validateUser(msg.sender) returns (uint256) {
        uint256 ans=0;
        for(uint256 i=0;i<user_credit_type_list[msg.sender].length;i++){
            string memory creditType = user_credit_type_list[msg.sender][i];
            ans = ans + user_credit_list[msg.sender][creditType].creditQuantityInPortfolio;
        }
        return ans;
    }

    function getProjects(uint256 pageNumber) public view validateUser(msg.sender) returns (Data_Types.Project[10] memory) {
        require(pageNumber > 0,"Page number cannot be 0."  );
        require(pageNumber <= ceil(project_id_list.length,10),"No more projects");

        Data_Types.Project[10] memory projects;
        uint256 start = ((pageNumber-1)*10)+ 1; 
        uint256 end = start + 10;
        uint256 index =0;
        for(uint256 i= start;i<=end;i++){
            projects[index] = project_list[project_id_list[i]];
            index++;
        }
        return projects;
    }

    function getTransactionBy(uint256 fromIndex) public view validateOrgOrUser(msg.sender) returns (Data_Types.Transaction[10] memory) {
        require(fromIndex >= 0,"Invalid request"  );
        require(fromIndex <= transaction_id_list.length,"Invalid request.");
        uint256 startIndex = fromIndex == 0 ? transaction_id_list.length -1 : fromIndex-1 ;
        Data_Types.Transaction[10] memory transactions;
        uint256 index =0;
        while(index < 10 && startIndex >= 0){
            if(transaction_list[transaction_id_list[startIndex]].user_id == msg.sender){
                transactions[index] = transaction_list[transaction_id_list[startIndex]];
            }
            startIndex--;
            index++;
        }
        return transactions;
    }

    function getTotalEmissions() public view validateUser(msg.sender) returns (uint256) {
        uint256 ans = 0;
        for(uint256 i=0;i<user_emission_date_list[msg.sender].length;i++){
            uint256 date = user_emission_date_list[msg.sender][i];
            for(uint256 j=0;j<50;j++){
                if(bytes(user_emissions[msg.sender][date][j].category).length > 0){
                    ans = ans + user_emissions[msg.sender][date][j].emission_value;
                }
            }
        }
        return ans;
    }

    // function getProducts(
    //     uint256 lotSize,
    //     uint256 pageNumber
    // )
    //     public
    //     view
    //     validateUser(msg.sender)
    //     returns (Data_Types.Product[] memory)
    // {
    //     uint256 startIndex = lotSize * (pageNumber - 1);
    //     require(startIndex < product_list.length, "Invalid Page Number");
    //     return listProducts(lotSize, pageNumber);
    // }

    // function addContactDetails(
    //     string memory addr,
    //     string memory contact_number
    // ) public validateUser(msg.sender) {
    //     require(bytes(addr).length > 0, "Address cannot be empty");
    //     require(
    //         bytes(contact_number).length > 0,
    //         "Contact Number cannot be empty"
    //     );
    //     Data_Types.User_Address memory curr_Addr = Data_Types.User_Address({
    //         addr_id: user_addresses[msg.sender].length + 1,
    //         addr: addr,
    //         contact_number: contact_number
    //     });
    //     addAddress(curr_Addr, msg.sender);
    // }

    // function modifyContactDetails(
    //     string memory addr,
    //     string memory contact_number,
    //     uint256 id
    // ) public validateUser(msg.sender) {
    //     require(bytes(addr).length > 0, "Address cannot be empty");
    //     require(
    //         bytes(contact_number).length > 0,
    //         "Contact Number cannot be empty"
    //     );
    //     require(user_addresses[msg.sender].length > id && id > 0, "Invalid ID");
    //     Data_Types.User_Address memory curr_Addr = Data_Types.User_Address({
    //         addr_id: id,
    //         addr: addr,
    //         contact_number: contact_number
    //     });
    //     editAddress(curr_Addr, msg.sender, id);
    // }

    // function listProduct(
    //     uint256 product_id,
    //     string memory product_name,
    //     uint256 price,
    //     uint256 stock,
    //     uint256 max_limit_per_purchase,
    //     uint256 delivery_charges,
    //     string[5] memory tags
    // ) public validateUser(msg.sender) {
    //     require(product_id > 0, "Invalid Product ID");
    //     require(bytes(product_name).length > 0, "Invalid Product Name");
    //     require(price > 0, "Invalid Price");
    //     require(stock > 0, "Invalid Stock");
    //     require(
    //         max_limit_per_purchase > 0 && max_limit_per_purchase < 5,
    //         "Invalid Limit"
    //     );
    //     // require()
    //     require(product_mapping[product_id] == 0, "Product Already Exists.");

    //     Data_Types.Product memory product = Data_Types.Product({
    //         product_id: product_id,
    //         product_name: product_name,
    //         price: price,
    //         stock: stock,
    //         max_limit_per_purchase: max_limit_per_purchase,
    //         delivery_charges: delivery_charges,
    //         tags: tags,
    //         owner_id: msg.sender
    //     });
    //     addProduct(product);
    // }

    // function modifyListedProduct(
    //     uint256 product_id,
    //     string memory product_name,
    //     uint256 price,
    //     uint256 stock,
    //     uint256 max_limit_per_purchase,
    //     uint256 delivery_charges,
    //     string[5] memory tags
    // ) public validateUser(msg.sender) {
    //     require(product_id > 0, "Invalid Product ID");
    //     require(bytes(product_name).length > 0, "Invalid Product Name");
    //     require(price > 0, "Invalid Price");
    //     require(stock > 0, "Invalid Stock");
    //     require(
    //         max_limit_per_purchase > 0 && max_limit_per_purchase < 5,
    //         "Invalid Limit"
    //     );
    //     require(product_mapping[product_id] != 0, "Product doesn't exist.");
    //     Data_Types.Product memory product = Data_Types.Product({
    //         product_id: product_id,
    //         product_name: product_name,
    //         price: price,
    //         stock: stock,
    //         max_limit_per_purchase: max_limit_per_purchase,
    //         delivery_charges: delivery_charges,
    //         tags: tags,
    //         owner_id: msg.sender
    //     });
    //     editProduct(product, product_id);
    // }

    // function deleteProductFromListing(
    //     uint256 product_id
    // ) public validateUser(msg.sender) {
    //     deleteProduct(product_id);
    // }

    // function buyProduct(
    //     uint256 product_id,
    //     uint256 quantity
    // ) external payable validateUser(msg.sender) {
    //     require(product_mapping[product_id] != 0, "Product doesn't exist");
    //     require(
    //         quantity <=
    //             product_list[product_mapping[product_id] - 1]
    //                 .max_limit_per_purchase,
    //         "Cannot buy the mentioned quantity."
    //     );
    //     require(
    //         quantity <= product_list[product_mapping[product_id] - 1].stock,
    //         "Cannot buy the mentioned quantity."
    //     );
    //     require(
    //         msg.sender !=
    //             product_list[product_mapping[product_id] - 1].owner_id,
    //         "Seller can't buy the product."
    //     );
    //     require(
    //         msg.value ==
    //             product_list[product_mapping[product_id] - 1].delivery_charges +
    //                 (quantity *
    //                     product_list[product_mapping[product_id] - 1].price),
    //         "Invalid amount"
    //     );
    //     Data_Types.Order memory order = Data_Types.Order({
    //         product_id: product_id,
    //         quantity: quantity,
    //         order_status: IN_TRANSIT,
    //         order_id: order_list[msg.sender].length + 1,
    //         buyer_id: msg.sender
    //     });
    //     // Order added
    //     placeOrder(order, msg.sender);
    //     // Transfer Money to Escrow
    //     escrow_amount += msg.value;
    //     Data_Types.Transaction memory transaction = Data_Types.Transaction({
    //         transaction_type: BUY,
    //         transaction_id: order_transaction_list[msg.sender].length + 1,
    //         amount: product_list[product_mapping[product_id] - 1]
    //             .delivery_charges +
    //             (quantity *
    //                 product_list[product_mapping[product_id] - 1].price),
    //         status: OUTSTANDING,
    //         delivery_charges: product_list[product_mapping[product_id] - 1]
    //             .delivery_charges,
    //         platform_fee: 0,
    //         convinience_fee: 0,
    //         token_charges: 0,
    //         order_id: order_list[msg.sender].length
    //     });
    //     addTransaction(transaction, msg.sender);
    // }

    // function deliverProduct(
    //     address buyer_id,
    //     uint256 order_id
    // // ) external validateUser(msg.sender) nonReentrant {
    // ) external validateUser(msg.sender)  {
    //     // // Mark as Delivered
    //     require(order_list[buyer_id].length > 0, "Invalid Order ID");
    //     uint256 index = 0;
    //     uint256 flag = 0;
    //     for (uint256 i = 0; i < order_list[buyer_id].length; i++) {
    //         if (order_list[buyer_id][i].order_id == order_id) {
    //             index = i;
    //             flag = 1;
    //         }
    //     }
    //     require(flag == 1, "No such order found");
    //     Data_Types.Order memory order = order_list[buyer_id][index];
    //     Data_Types.Product memory product = product_list[
    //         uint256(product_mapping[order.product_id]) - 1
    //     ];
    //     require(
    //         msg.sender == product.owner_id,
    //         "You are not authorized to mark this as delivered."
    //     );
    //     require(
    //         keccak256(abi.encodePacked(order.order_status)) ==
    //             keccak256(abi.encodePacked(IN_TRANSIT)),
    //         "This action is not permitted"
    //     );
    //     uint256 transactionIndex = 0;
    //     uint256 found = 0;
    //     for (uint256 i = 0; i < order_transaction_list[buyer_id].length; i++) {
    //         if (
    //             order_transaction_list[buyer_id][i].order_id == order_id &&
    //             keccak256(
    //                 abi.encodePacked(
    //                     order_transaction_list[buyer_id][i].transaction_type
    //                 )
    //             ) ==
    //             keccak256(abi.encodePacked(BUY)) &&
    //             keccak256(
    //                 abi.encodePacked(order_transaction_list[buyer_id][i].status)
    //             ) ==
    //             keccak256(abi.encodePacked(OUTSTANDING))
    //         ) {
    //             transactionIndex = i;
    //             found = 1;
    //         }
    //     }
    //     require(found != 0, "No valid transaction found.");
    //     uint256 amountToTransfer = (order.quantity * product.price) +
    //         product.delivery_charges;
    //     address payable seller = payable(msg.sender);
    //     escrow_amount -= amountToTransfer;
    //     seller.transfer(amountToTransfer);
    //     markAsDelivered(buyer_id, index);
    //     markTransactionAsPaid(buyer_id, transactionIndex);
    // }
}
