// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./Database.sol";

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
            bytes(user_list[addr].first_name).length != 0,
            "User doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrg(address addr) {
        require(
            bytes(organization_list[addr].name).length != 0,
            "Organization doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrgOrUser(address addr) {
        require(
            bytes(user_list[addr].first_name).length != 0 || bytes(organization_list[addr].name).length != 0,
            "Invalid Login!! Please register."
        );
        _;
    }

    function registerUser(
        Data_Types.RegisterUserType memory args
    ) external returns (bool) {
        // Validation
        require(
            bytes(args.first_name).length != 0,
            "First Name cannot be empty"
        );
        require(bytes(args.last_name).length != 0, "Last Name cannot be empty");
        require(bytes(args.email).length != 0, "Email cannot be empty");
        require(bytes(args.gender).length != 0, "Gender cannot be empty");
        require(args.date_of_birth != 0, "DOB cannot be empty");

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
        external
        view
        validateOrgOrUser(msg.sender)
        returns (bool)
    {
        return true;
    }

    function addEmission(
        Data_Types.AddEmissionType memory args
    ) external validateUser(msg.sender) returns (bool) {
        return addEmissionToList(args.date, args.emissions, msg.sender);
    }

    function fetchEmissions(
        Data_Types.FetchEmissionsType memory args
    ) external validateUser(msg.sender) view returns (Data_Types.DateEmission[10] memory) {
        Data_Types.DateEmission[10] memory emission_history;
        uint256 step = 24 * 3600 * 1000;
        uint256 index = 0;
        for (uint256 i = args.from; i <= args.to; i = i + step) {
            if (!(user_emissions[msg.sender][i].length != 0)) {
                continue;
            }
            Data_Types.DateEmission memory temp;
            temp.date = i;
            uint256 size = user_emissions[msg.sender][i].length;
            for(uint256 j=0;j<size;){
                temp.emission[j] = user_emissions[msg.sender][i][j];
                unchecked{
                    ++j;
                }
            }
            emission_history[index] = temp;
            index = index + 1;
        }
        return emission_history;
    }

    function registerOrganization(
        Data_Types.RegisterOrgType memory args
    ) external returns (bool) {
        // Validation
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(bytes(args.email).length != 0, "Email cannot be empty");

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


    function addProject(Data_Types.ProjectType memory args) external validateOrg(msg.sender) returns (bool) {
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(bytes(args.description).length != 0, "Description cannot be empty.");
        require(bytes(args.creditType).length != 0, "Credit Type must be provided.");
        require(args.creditQuantity != 0, "Quantity must be more than zero.");
        // Verify credits from third party libraries/wallets
        require(validateProjectCredits(),"Credits could not be verified.");
        uint256 project_id = project_id_list.length + 1;
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

    function editProject(Data_Types.EditProjectType memory args) external validateOrg(msg.sender)  returns (bool) {
        require(bytes(project_list[args.id].name).length != 0,"Project doesn't exist.");
        require(project_list[args.id].org_id == msg.sender,"Project doesn't exist.");
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("ACTIVE")) || keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("INACTIVE")), "Status is invalid.");
        require(bytes(args.description).length != 0, "Description cannot be empty.");
        require(bytes(args.creditType).length != 0, "Credit Type must be provided.");
        require(args.creditQuantity != 0, "Quantity must be more than zero.");
        require(validateProjectCredits(),"Credits could not be verified.");
        return editProjectFromList(args.id,args.name,args.description,args.status);
    }

    function addProjectToCart(Data_Types.AddProjectToCartType memory args) external validateUser(msg.sender)  returns (bool) {
        require(args.quantity != 0, "Quantity must be more than zero.");
        require(bytes(project_list[args.projectId].name).length != 0,"Invalid Project");
        require(keccak256(abi.encodePacked(project_list[args.projectId].status)) == keccak256(abi.encodePacked("ACTIVE")),"Invalid Project");
        string memory creditType = project_list[args.projectId].creditType;
        uint256 oldQuantity = user_cart_list[msg.sender][args.projectId].isCartEmpty ? 0 : user_cart_list[msg.sender][args.projectId].creditQuantityInCart;
        require(project_list[args.projectId].creditQuantity + 1 > args.quantity +oldQuantity ,"Cannot add to cart.");
        return addProjectToCartDB(args,creditType);
    }

    function makeCartEmpty(Data_Types.MakeCartEmptyType memory args) external validateUser(msg.sender) returns  (bool) {
        return makeUserCartEmpty(args.projectId);
    }

    function buyCreditsFromCart() external payable validateUser(msg.sender) returns (bool) {
        uint256 isEmptyCart = 0;
        uint256 inStock = 1;    
        uint256 totalPrice = 0;
        uint256 size = user_cart_id_list[msg.sender].length;
        for(uint256 i=0;i<size;){
            uint256 projectId = user_cart_id_list[msg.sender][i];
            if(user_cart_list[msg.sender][projectId].creditQuantityInCart != 0){
                isEmptyCart = 1;
                totalPrice = totalPrice + (user_cart_list[msg.sender][projectId].creditQuantityInCart * getCreditPrice() );
            }
            if(project_list[projectId].creditQuantity < user_cart_list[msg.sender][projectId].creditQuantityInCart){
                inStock = 0;
            }
            unchecked {
                ++i;
                }

        }
        require(isEmptyCart == 1,"Cart is empty.");
        require(inStock == 1,"Cannot place buy order.");
        require(totalPrice == msg.value, "Invalid amount");
        transferCredits();
        for(uint256 i=0;i<size;){
            uint256 projectId = user_cart_id_list[msg.sender][i];
            address payable orgAddress = payable(project_list[user_cart_id_list[msg.sender][i]].org_id);
            uint256 amount = user_cart_list[msg.sender][projectId].creditQuantityInCart * getCreditPrice() ;
            orgAddress.transfer(amount);
            unchecked
            {
                ++i;
            }
        }

        return true;
    }

    function fetchCart(uint256 fromIndex) external view validateUser(msg.sender)  returns (Data_Types.CartDetails[10] memory) {
        uint256 size= user_cart_id_list[msg.sender].length;
        require(fromIndex < size + 1,"Invalid request.");
        Data_Types.CartDetails[10] memory cartList;
        if(size == 0) return cartList;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            cartList[index] = user_cart_list[msg.sender][user_cart_id_list[msg.sender][startIndex]];
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return cartList;

    }

    function getPortfolio(uint256 fromIndex) external view validateUser(msg.sender)  returns (Data_Types.CreditDetails[10] memory) {
        uint256 size= user_credit_type_list[msg.sender].length;
        require(fromIndex < size + 1,"Invalid request.");
        Data_Types.CreditDetails[10] memory credits;
        if(size == 0) return credits;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            credits[index] = user_credit_list[msg.sender][user_credit_type_list[msg.sender][startIndex]];
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return credits;

    }

    function getTotalCreditCount() external view validateUser(msg.sender) returns (uint256) {
        uint256 ans=0;
        uint256 size = user_credit_type_list[msg.sender].length;
        for(uint256 i=0;i<size;){
            string memory creditType = user_credit_type_list[msg.sender][i];
            ans = ans + user_credit_list[msg.sender][creditType].creditQuantityInPortfolio;
            unchecked {
                    ++i;
            }
        }
        return ans;
    }

    function getProjects(uint256 pageNumber) external view validateUser(msg.sender) returns (Data_Types.Project[10] memory) {
        require(pageNumber != 0,"Page number cannot be 0."  );
        require(pageNumber < ceil(project_id_list.length,10) + 1,"No more projects");

        Data_Types.Project[10] memory projects;
        uint256 start = ((pageNumber-1)*10); 
        uint256 end = start + 10;
        uint256 projectsSize = project_id_list.length;
        if(end >= projectsSize){
            end = projectsSize - 1;
        }
        uint256 index =0;
        for(uint256 i= start;i<=end;){
            projects[index] = project_list[project_id_list[i]];
            unchecked{
                ++index;
                ++i;
            }
        }
        return projects;
    }

    function getTransactionBy(uint256 fromIndex) external view validateOrgOrUser(msg.sender) returns (Data_Types.Transaction[10] memory) {
        require(fromIndex < transaction_id_list.length + 1,"Invalid request.");
        uint256 size = transaction_id_list.length;
        Data_Types.Transaction[10] memory transactions;
        if(size == 0) return transactions;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            if(transaction_list[transaction_id_list[startIndex]].user_id == msg.sender || transaction_list[transaction_id_list[startIndex]].org_id == msg.sender){
                transactions[index] = transaction_list[transaction_id_list[startIndex]];
            }
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return transactions;
    }

    function getTotalEmissions() external view validateUser(msg.sender) returns (uint256) {
        uint256 ans = 0;
        uint256 size = user_emission_date_list[msg.sender].length;
        for(uint256 i=0;i<size;){
            uint256 date = user_emission_date_list[msg.sender][i];
            uint256 arraySieze =  user_emissions[msg.sender][date].length;
            for(uint256 j=0;j<arraySieze;){
                if(bytes(user_emissions[msg.sender][date][j].category).length != 0){
                    ans = ans + user_emissions[msg.sender][date][j].emission_value;
                }
                unchecked {
                    ++j;
                }
            }
            unchecked {
                    ++i;
                }
        }
        return ans;
    }
}
