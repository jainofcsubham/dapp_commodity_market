// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./Data_Types.sol";
import "hardhat/console.sol";

contract Database {
    address public owner;

    // Constructor
    constructor() payable {
        owner = msg.sender;
    }

    // Private data
    // User address => Time Stamp => Emissions List
    // User related DS
    mapping(address => mapping(uint256 => Data_Types.Emission[])) user_emissions;
    mapping(address => Data_Types.User) user_list;
    mapping(address => uint256[]) user_emission_date_list;
    mapping(address => mapping(string => Data_Types.CreditDetails)) user_credit_list;
    mapping(address => string[]) user_credit_type_list;
    mapping(address => mapping(uint256 => Data_Types.CartDetails)) user_cart_list;
    mapping(address => uint256[]) user_cart_id_list;

    // Org related DS
    mapping(address => Data_Types.Organization) organization_list;
    // Project related DS
    mapping(uint256 => Data_Types.Project) project_list;
    uint256[] project_id_list;

    // Transaction related DS
    mapping(uint256 => Data_Types.Transaction) transaction_list;
    uint256[] transaction_id_list;

    // events
    event UserRegistered(address userAddress, string username);
    event OrganizationRegistered(address orgAddress, string orgName);
    event ProjectAdded(uint256 project_id, string projectName, address org_id);
    event ProjectEdited(uint256 project_id, string projectName, address org_id);

    // Public functions accessible from the implementation contract
    function addUser(Data_Types.User memory newUser) public {
        user_list[newUser.user_address] = newUser;
        emit UserRegistered(
            newUser.user_address,
            string.concat(newUser.first_name, newUser.last_name)
        );
    }

    function addOrganization(
        Data_Types.Organization memory newOrganization
    ) public {
        organization_list[newOrganization.id] = newOrganization;
        emit OrganizationRegistered(newOrganization.id, newOrganization.name);
    }

    function addEmissionToList(
        uint256 date,
        Data_Types.Emission[50] memory emissions,
        address sender
    ) public returns (bool) {
        if (!(user_emissions[sender][date].length != 0)) {
            user_emission_date_list[sender].push(date);
        }
        uint256 existingArraySize = user_emissions[sender][date].length;
        uint256 size = emissions.length;
        for (uint256 k = 0; k < size; ) {
            if (bytes(emissions[k].category).length != 0) {
                if (k >= existingArraySize) {
                    user_emissions[sender][date].push(emissions[k]);
                } else {
                    user_emissions[sender][date][k] = emissions[k];
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
        Data_Types.Project memory args
    ) public returns (bool) {
        project_id_list.push(id);
        project_list[id] = args;
        emit ProjectAdded(args.id, args.name, args.org_id);
        return true;
    }

    function editProjectFromList(
        uint256 id,
        string memory name,
        string memory desc,
        string memory status
    ) public returns (bool) {
        project_list[id].name = name;
        project_list[id].description = desc;
        project_list[id].status = status;
        emit ProjectEdited(
            project_list[id].id,
            project_list[id].name,
            project_list[id].org_id
        );
        return true;
    }

    function addProjectToCartDB(
        Data_Types.AddProjectToCartType memory args,
        string memory creditType
    ) public returns (bool) {
        if (
            !(bytes(user_cart_list[msg.sender][args.projectId].creditType)
                .length != 0)
        ) {
            user_cart_id_list[msg.sender].push(args.projectId);
        }
        user_cart_list[msg.sender][args.projectId].creditType = creditType;
        user_cart_list[msg.sender][args.projectId]
            .creditQuantityInCart = user_cart_list[msg.sender][args.projectId]
            .isCartEmpty
            ? user_cart_list[msg.sender][args.projectId].creditQuantityInCart +
                args.quantity
            : args.quantity;
        user_cart_list[msg.sender][args.projectId].isCartEmpty = false;
        return true;
    }

    function transferCredits() public returns (bool) {
        uint256 size = user_cart_id_list[msg.sender].length;
        for (uint256 i = 0; i < size; ) {
            uint256 projectId = user_cart_id_list[msg.sender][i];
            user_cart_list[msg.sender][projectId].isCartEmpty = true;
            uint256 quantity = user_cart_list[msg.sender][projectId]
                .creditQuantityInCart;
            project_list[projectId].creditQuantity =
                project_list[projectId].creditQuantity -
                quantity;
            string memory creditType = user_cart_list[msg.sender][projectId]
                .creditType;
            if (
                !(bytes(user_credit_list[msg.sender][creditType].creditType)
                    .length != 0)
            ) {
                user_credit_type_list[msg.sender].push(creditType);
            }
            uint256 totalQuantity = user_credit_list[msg.sender][creditType]
                .creditQuantityInPortfolio + quantity;
            uint256 avgPrice = ((user_credit_list[msg.sender][creditType]
                .creditQuantityInPortfolio *
                user_credit_list[msg.sender][creditType].boughtAt) +
                (quantity * 100)) / totalQuantity;
            user_credit_list[msg.sender][creditType].creditType = creditType;
            user_credit_list[msg.sender][creditType]
                .creditQuantityInPortfolio = totalQuantity;
            user_credit_list[msg.sender][creditType].boughtAt = avgPrice;
            uint256 id = transaction_id_list.length;
            transaction_id_list.push(id);
            transaction_list[id].id = id;
            transaction_list[id].org_id = project_list[projectId].org_id;
            transaction_list[id].user_id = msg.sender;
            transaction_list[id].project_id = projectId;
            transaction_list[id].count = quantity;
            transaction_list[id].boughtAt = 100;
            transaction_list[id].creditType = creditType;
            unchecked {
                ++i;
            }
        }

        return true;
    }

    function makeUserCartEmpty(uint256 projectId) public returns (bool) {
        user_cart_list[msg.sender][projectId].creditQuantityInCart = 0;
        user_cart_list[msg.sender][projectId].isCartEmpty = true;
        return true;
    }
}
