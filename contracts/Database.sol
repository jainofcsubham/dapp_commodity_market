// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./DataTypes.sol";

contract Database {
    address public immutable owner;

    // Constructor
    constructor() payable {
        owner = msg.sender;
    }

    // Private data
    // User address => Time Stamp => Emissions List
    // User related DS
    mapping(address => mapping(uint256 => DataTypes.Emission[])) internal userEmissions;
    mapping(address => DataTypes.User) internal userList;
    mapping(address => uint256[]) internal userEmissionDateList;
    mapping(address => mapping(string => DataTypes.CreditDetails)) internal userCreditList;
    mapping(address => string[]) internal userCreditTypeList;
    mapping(address => mapping(uint256 => DataTypes.CartDetails)) internal userCartList;
    mapping(address => uint256[]) internal userCartIdList;

    // Org related DS
    mapping(address => DataTypes.Organization) internal organizationList;
    // Project related DS
    mapping(uint256 => DataTypes.Project ) internal projectList;
    uint256[]internal projectIdList;

    // Transaction related DS
    mapping(uint256 => DataTypes.Transaction) internal transactionList;
    uint256[] internal transactionIdList;

    // events
    event UserRegistered(address userAddress, string username);
    event OrganizationRegistered(address orgAddress, string orgName);
    event ProjectAdded(uint256 project_id, string projectName, address org_id);
    event ProjectEdited(uint256 project_id, string projectName, address org_id);

    // Public functions accessible from the implementation contract
    function addUser(DataTypes.User memory newUser) public {
        userList[newUser.user_address] = newUser;
        emit UserRegistered(
            newUser.user_address,
            string.concat(newUser.first_name, newUser.last_name)
        );
    }

    function addOrganization(
        DataTypes.Organization memory newOrganization
    ) public {
        organizationList[newOrganization.id] = newOrganization;
        emit OrganizationRegistered(newOrganization.id, newOrganization.name);
    }

    function addEmissionToList(
        uint256 date,
        DataTypes.Emission[50] memory emissions,
        address sender
    ) public returns (bool) {
        if (!(userEmissions[sender][date].length != 0)) {
            userEmissionDateList[sender].push(date);
        }
        uint256 existingArraySize = userEmissions[sender][date].length;
        uint256 size = emissions.length;
        for (uint256 k = 0; k < size; ) {
            if (bytes(emissions[k].category).length != 0) {
                if (k >= existingArraySize) {
                    userEmissions[sender][date].push(emissions[k]);
                } else {
                    userEmissions[sender][date][k] = emissions[k];
                }
            }
            unchecked {
                ++k;
            }
        }
        return true;
    }

    function addProjectToList(
        uint256 id,
        DataTypes.Project memory args
    ) public returns (bool) {
        projectIdList.push(id);
        projectList[id] = args;
        emit ProjectAdded(args.id, args.name, args.org_id);
        return true;
    }

    function editProjectFromList(
        uint256 id,
        string memory name,
        string memory desc,
        string memory status
    ) public returns (bool) {
        projectList[id].name = name;
        projectList[id].description = desc;
        projectList[id].status = status;
        emit ProjectEdited(
            projectList[id].id,
            projectList[id].name,
            projectList[id].org_id
        );
        return true;
    }

    function addProjectToCartDB(
        DataTypes.AddProjectToCartType memory args,
        string memory creditType
    ) public returns (bool) {
        if (
            !(bytes(userCartList[msg.sender][args.projectId].creditType)
                .length != 0)
        ) {
            userCartIdList[msg.sender].push(args.projectId);
        }
        userCartList[msg.sender][args.projectId].creditType = creditType;
        userCartList[msg.sender][args.projectId]
            .creditQuantityInCart = userCartList[msg.sender][args.projectId]
            .isCartEmpty
            ? userCartList[msg.sender][args.projectId].creditQuantityInCart +
                args.quantity
            : args.quantity;
        userCartList[msg.sender][args.projectId].isCartEmpty = false;
        return true;
    }

    function transferCredits() public returns (bool) {
        uint256 size = userCartIdList[msg.sender].length;
        for (uint256 i = 0; i < size; ) {
            uint256 projectId = userCartIdList[msg.sender][i];
            userCartList[msg.sender][projectId].isCartEmpty = true;
            uint256 quantity = userCartList[msg.sender][projectId]
                .creditQuantityInCart;
            projectList[projectId].creditQuantity =
                projectList[projectId].creditQuantity -
                quantity;
            string memory creditType = userCartList[msg.sender][projectId]
                .creditType;
            if (
                !(bytes(userCreditList[msg.sender][creditType].creditType)
                    .length != 0)
            ) {
                userCreditTypeList[msg.sender].push(creditType);
            }
            uint256 totalQuantity = userCreditList[msg.sender][creditType]
                .creditQuantityInPortfolio + quantity;
            uint256 avgPrice = ((userCreditList[msg.sender][creditType]
                .creditQuantityInPortfolio *
                userCreditList[msg.sender][creditType].boughtAt) +
                (quantity * 100)) / totalQuantity;
            userCreditList[msg.sender][creditType].creditType = creditType;
            userCreditList[msg.sender][creditType]
                .creditQuantityInPortfolio = totalQuantity;
            userCreditList[msg.sender][creditType].boughtAt = avgPrice;
            uint256 id = transactionIdList.length;
            transactionIdList.push(id);
            transactionList[id].id = id;
            transactionList[id].org_id = projectList[projectId].org_id;
            transactionList[id].user_id = msg.sender;
            transactionList[id].project_id = projectId;
            transactionList[id].count = quantity;
            transactionList[id].boughtAt = 100;
            transactionList[id].creditType = creditType;
            unchecked {
                ++i;
            }
        }

        return true;
    }

    function makeUserCartEmpty(uint256 projectId) public returns (bool) {
        userCartList[msg.sender][projectId].creditQuantityInCart = 0;
        userCartList[msg.sender][projectId].isCartEmpty = true;
        return true;
    }
}
