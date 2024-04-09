// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


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
        uint256 id;
        string first_name;
        string last_name;
        string email;
        uint256 date_of_birth;
        string gender;
        uint256[] date_list;
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
}