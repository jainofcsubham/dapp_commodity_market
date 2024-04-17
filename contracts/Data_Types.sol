// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;


library  Data_Types {

    struct Emission {
        string category;
        string factor_name;
        string value;
        string value_type;
        uint256 emission_value;
    }
    
    struct User{
        address user_address;
        string first_name;
        string last_name;
        string email;
        uint256 date_of_birth;
        string gender;
    }

    struct DateEmission {
        uint256 date;
        Emission[50] emission;
    }

    struct RegisterUserType {
        string  first_name;
        string  last_name;
        string  email;
        uint256  date_of_birth;
        string  gender;
    }

    struct AddEmissionType {
        uint256 date;
        Data_Types.Emission[50] emissions; 
    }

    struct FetchEmissionsType {
        uint256 from;
        uint256 to;
    }

    struct Organization {
        string name;
        address id;
        string email;
    }

    struct RegisterOrgType {
        string  name;
        string  email;
    }

    struct Project {
        uint256 id;
        string name;
        address org_id;
        string description;
        string status; 
        uint256 creditQuantity;
        string creditType;
    }

    struct  ProjectType {
        string name;
        string description;
        string creditType;
        uint256 creditQuantity;
    }

    struct  EditProjectType {
        uint256 id;
        string name;
        string description;
        string status; 
        string creditType;
        uint256 creditQuantity;
    }

    struct Transaction {
        uint256 id;
        address org_id;
        address user_id;
        uint256 project_id;
        uint256 count;
        uint256 boughtAt; // In wei
        string creditType;
    }

    struct CreditDetails {
        string creditType;
        uint256 creditQuantityInPortfolio;
        uint256 boughtAt; // In wei;
    }

    struct CartDetails {
        string creditType;
        uint256 creditQuantityInCart;
        bool isCartEmpty;

    }

    struct AddProjectToCartType{
        uint256 projectId;
        uint256 quantity;
    }

    struct MakeCartEmptyType {
        uint256 projectId;
    }

}