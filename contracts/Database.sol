// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Data_Types.sol";
import "./ABDKMathQuad.sol";

contract Database {
    address public owner;

    // Constructor
    constructor(){
        owner = msg.sender;
    }

    // User address => Time Stamp => Emissions List
    mapping(address => mapping(uint256 => Data_Types.Emission[50])) public user_emissions;
    // Private data
    mapping(address => Data_Types.User) user_list;

    // events
    event UserRegistered(address userAddress, string username);

    // Public functions accessible from the implementation contract
    function addUser(Data_Types.User memory newUser) public {
        user_list[newUser.user_address] = newUser;
        emit UserRegistered(newUser.user_address, string.concat(newUser.first_name,newUser.last_name));
    }

    function addEmissionToList(uint256 date,Data_Types.Emission[50] memory emissions,address sender) public returns (bool) {
        if( !(user_emissions[sender][date].length > 0 )){
            user_list[sender].date_list.push(date);
        }
        // user_emissions[sender][date] = emissions;
        for(uint256 k=0;k<50;k++){
                user_emissions[sender][date][k].category = emissions[k].category;
                user_emissions[sender][date][k].factor_name = emissions[k].factor_name;
                user_emissions[sender][date][k].value = emissions[k].value;
                user_emissions[sender][date][k].value_type = emissions[k].value_type;
                user_emissions[sender][date][k].emission_value = emissions[k].emission_value;
            }
        return true;
    }

}
