// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./Database.sol";

contract Functionality is Database {

    // Utility function 
    function ceil(uint256 numerator, uint256 denominator) public pure returns (uint256) {
        return (numerator + denominator - 1) / denominator;
    }

    // Third party functions 
    function validateProjectCredits() internal pure returns (bool){
        return true;
    }

    function getCreditPrice () internal pure returns (uint256) {
        return 1;
    }

    // Modifiers

    modifier validateUser(address addr) {
        require(
            bytes(userList[addr].first_name).length != 0,
            "User doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrg(address addr) {
        require(
            bytes(organizationList[addr].name).length != 0,
            "Organization doesn't exist. Please register."
        );
        _;
    }

    modifier validateOrgOrUser(address addr) {
        require(
            bytes(userList[addr].first_name).length != 0 || bytes(organizationList[addr].name).length != 0,
            "Invalid Login!! Please register."
        );
        _;
    }

    function registerUser(
        DataTypes.RegisterUserType memory args
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
        DataTypes.User memory user = userList[msg.sender];
        require(
            bytes(userList[msg.sender].first_name).length == 0,
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
        returns (DataTypes.LoginReturnType memory)
    {
        DataTypes.LoginReturnType memory res;
        if(bytes(userList[msg.sender].first_name).length != 0) {
            res.user = userList[msg.sender]; 
            res.isOrg = false;
        }
        else if(bytes(organizationList[msg.sender].name).length != 0) {
            res.org = organizationList[msg.sender]; 
            res.isOrg = true;
        }
        return res;
    }

    function addEmission(
        DataTypes.AddEmissionType memory args
    ) external validateUser(msg.sender) returns (bool) {
        return addEmissionToList(args.date, args.emissions, msg.sender);
    }

    function fetchEmissions(
        DataTypes.FetchEmissionsType memory args
    ) external validateUser(msg.sender) view returns (DataTypes.DateEmission[10] memory) {
        DataTypes.DateEmission[10] memory emission_history;
        uint256 step = 24 * 3600 * 1000;
        uint256 index = 0;
        for (uint256 i = args.from; i <= args.to; i = i + step) {
            if (!(userEmissions[msg.sender][i].length != 0)) {
                continue;
            }
            DataTypes.DateEmission memory temp;
            temp.date = i;
            uint256 size = userEmissions[msg.sender][i].length;
            for(uint256 j=0;j<size;){
                temp.emission[j] = userEmissions[msg.sender][i][j];
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
        DataTypes.RegisterOrgType memory args
    ) external returns (bool) {
        // Validation
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(bytes(args.email).length != 0, "Email cannot be empty");

        // Logic
        DataTypes.Organization memory org = organizationList[msg.sender];
        require(
            bytes(organizationList[msg.sender].name).length == 0,
            "Organization already registered."
        );
        org.name = args.name;
        org.email = args.email;
        org.id = msg.sender;
        addOrganization(org);
        return true;
    }


    function addProject(DataTypes.ProjectType memory args) external validateOrg(msg.sender) returns (bool) {
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(bytes(args.description).length != 0, "Description cannot be empty.");
        require(bytes(args.creditType).length != 0, "Credit Type must be provided.");
        require(args.creditQuantity != 0, "Quantity must be more than zero.");
        // Verify credits from third party libraries/wallets
        require(validateProjectCredits(),"Credits could not be verified.");
        uint256 project_id = projectIdList.length + 1;
        DataTypes.Project memory project;
        project.name = args.name;
        project.description = args.description;
        project.id = project_id;
        project.org_id = msg.sender;
        project.status = 'ACTIVE';
        project.creditType = args.creditType;
        project.creditQuantity = args.creditQuantity;
        return addProjectToList(project_id,project);
    }

    function editProject(DataTypes.EditProjectType memory args) external validateOrg(msg.sender)  returns (bool) {
        require(bytes(projectList[args.id].name).length != 0,"Project doesn't exist.");
        require(projectList[args.id].org_id == msg.sender,"Project doesn't exist.");
        require(bytes(args.name).length != 0, "Name cannot be empty");
        require(keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("ACTIVE")) || keccak256(abi.encodePacked(args.status)) == keccak256(abi.encodePacked("INACTIVE")), "Status is invalid.");
        require(bytes(args.description).length != 0, "Description cannot be empty.");
        require(bytes(args.creditType).length != 0, "Credit Type must be provided.");
        require(args.creditQuantity != 0, "Quantity must be more than zero.");
        require(validateProjectCredits(),"Credits could not be verified.");
        return editProjectFromList(args.id,args.name,args.description,args.status);
    }

    function addProjectToCart(DataTypes.AddProjectToCartType memory args) external validateUser(msg.sender)  returns (bool) {
        require(args.quantity != 0, "Quantity must be more than zero.");
        require(bytes(projectList[args.projectId].name).length != 0,"Invalid Project");
        require(keccak256(abi.encodePacked(projectList[args.projectId].status)) == keccak256(abi.encodePacked("ACTIVE")),"Invalid Project");
        string memory creditType = projectList[args.projectId].creditType;
        uint256 oldQuantity = userCartList[msg.sender][args.projectId].isCartEmpty ? 0 : userCartList[msg.sender][args.projectId].creditQuantityInCart;
        require(projectList[args.projectId].creditQuantity + 1 > args.quantity +oldQuantity ,"Cannot add to cart.");
        return addProjectToCartDB(args,creditType);
    }

    function makeCartEmpty(DataTypes.MakeCartEmptyType memory args) external validateUser(msg.sender) returns  (bool) {
        return makeUserCartEmpty(args.projectId);
    }

    function buyCreditsFromCart() external payable validateUser(msg.sender) returns (bool) {
        uint256 isEmptyCart = 0;
        uint256 inStock = 1;    
        uint256 totalPrice = 0;
        uint256 size = userCartIdList[msg.sender].length;
        for(uint256 i=0;i<size;){
            uint256 projectId = userCartIdList[msg.sender][i];
            if(userCartList[msg.sender][projectId].creditQuantityInCart != 0){
                isEmptyCart = 1;
                totalPrice = totalPrice + (userCartList[msg.sender][projectId].creditQuantityInCart * getCreditPrice() );
            }
            if(projectList[projectId].creditQuantity < userCartList[msg.sender][projectId].creditQuantityInCart){
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
            uint256 projectId = userCartIdList[msg.sender][i];
            address payable orgAddress = payable(projectList[userCartIdList[msg.sender][i]].org_id);
            uint256 amount = userCartList[msg.sender][projectId].creditQuantityInCart * getCreditPrice() ;
            orgAddress.transfer(amount);
            unchecked
            {
                ++i;
            }
        }

        return true;
    }

    function fetchCart(uint256 fromIndex) external view validateUser(msg.sender)  returns (DataTypes.CartDetails[10] memory) {
        uint256 size= userCartIdList[msg.sender].length;
        require(fromIndex < size + 1,"Invalid request.");
        DataTypes.CartDetails[10] memory cartList;
        if(size == 0) return cartList;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            cartList[index] = userCartList[msg.sender][userCartIdList[msg.sender][startIndex]];
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return cartList;

    }

    function getPortfolio(uint256 fromIndex) external view validateUser(msg.sender)  returns (DataTypes.CreditDetails[10] memory) {
        uint256 size= userCreditTypeList[msg.sender].length;
        require(fromIndex < size + 1,"Invalid request.");
        DataTypes.CreditDetails[10] memory credits;
        if(size == 0) return credits;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            credits[index] = userCreditList[msg.sender][userCreditTypeList[msg.sender][startIndex]];
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return credits;

    }

    function getTotalCreditCount() external view validateUser(msg.sender) returns (uint256) {
        uint256 ans=0;
        uint256 size = userCreditTypeList[msg.sender].length;
        for(uint256 i=0;i<size;){
            string memory creditType = userCreditTypeList[msg.sender][i];
            ans = ans + userCreditList[msg.sender][creditType].creditQuantityInPortfolio;
            unchecked {
                    ++i;
            }
        }
        return ans;
    }

    function getProjects(uint256 pageNumber) external view validateUser(msg.sender) returns (DataTypes.Project[10] memory) {
        require(pageNumber != 0,"Page number cannot be 0."  );
        require(pageNumber < ceil(projectIdList.length,10) + 1,"No more projects");

        DataTypes.Project[10] memory projects;
        uint256 start = ((pageNumber-1)*10); 
        uint256 end = start + 10;
        uint256 projectsSize = projectIdList.length;
        if(end >= projectsSize){
            end = projectsSize - 1;
        }
        uint256 index =0;
        for(uint256 i= start;i<=end;){
            projects[index] = projectList[projectIdList[i]];
            unchecked{
                ++index;
                ++i;
            }
        }
        return projects;
    }

    function getTransactionBy(uint256 fromIndex) external view validateOrgOrUser(msg.sender) returns (DataTypes.Transaction[10] memory) {
        require(fromIndex < transactionIdList.length + 1,"Invalid request.");
        uint256 size = transactionIdList.length;
        DataTypes.Transaction[10] memory transactions;
        if(size == 0) return transactions;
        uint256 startIndex = fromIndex == 0 ? size -1 : fromIndex-1 ;
        uint256 index =0;
        while(index < 10 && startIndex >= 0 && startIndex < size){
            if(transactionList[transactionIdList[startIndex]].user_id == msg.sender || transactionList[transactionIdList[startIndex]].org_id == msg.sender){
                transactions[index] = transactionList[transactionIdList[startIndex]];
            }
            if(startIndex == 0) break;
            startIndex--;
            ++index;
        }
        return transactions;
    }

    function getTotalEmissions() external view validateUser(msg.sender) returns (uint256) {
        uint256 ans = 0;
        uint256 size = userEmissionDateList[msg.sender].length;
        for(uint256 i=0;i<size;){
            uint256 date = userEmissionDateList[msg.sender][i];
            uint256 arraySieze =  userEmissions[msg.sender][date].length;
            for(uint256 j=0;j<arraySieze;){
                if(bytes(userEmissions[msg.sender][date][j].category).length != 0){
                    ans = ans + userEmissions[msg.sender][date][j].emission_value;
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
