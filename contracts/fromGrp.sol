// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract CarbonTracker {
//     // ERC20 Token
//     ERC20 public carbonToken;

//     // Struct to represent individual users
//     struct User {
//         uint256 id;
//         string username;
//         mapping(uint256 => uint256) emissions; // Mapping to store daily emissions
//         mapping(address => uint256) credits; // Mapping to store credits bought from green projects
//     }

//     // Struct to represent organizations
//     struct Organization {
//         uint256 id;
//         string name;
//         mapping(address => bool) projects; // Mapping to store green projects listed by the organization
//     }

//     // Array of users and organizations
//     User[] public users;
//     Organization[] public organizations;

//     // Mapping of addresses to user/organization IDs
//     mapping(address => uint256) public userAddresses;
//     mapping(address => uint256) public organizationAddresses;

//     // Events to track user and organization registration
//     event UserRegistered(uint256 userId, string username);
//     event OrganizationRegistered(uint256 orgId, string name);

//     // Events for buying and selling credits
//     event CreditsBought(address indexed user, address indexed project, uint256 amount);
//     event CreditsSold(address indexed user, address indexed project, uint256 amount);

//     constructor(address _carbonToken) {
//         carbonToken = ERC20(_carbonToken);
//     }

//     // Function to register individual users
//     function registerUser(string memory _username) external {
//         require(userAddresses[msg.sender] == 0, "User already registered");
        
//         // Creating a new user
//         uint256 userId = users.length;
//         users.push(User(userId, _username));
//         userAddresses[msg.sender] = userId;

//         emit UserRegistered(userId, _username);
//     }

//     // Function to register organizations
//     function registerOrganization(string memory _name) external {
//         require(organizationAddresses[msg.sender] == 0, "Organization already registered");

//         // Creating a new organization
//         uint256 orgId = organizations.length;
//         organizations.push(Organization(orgId, _name));
//         organizationAddresses[msg.sender] = orgId;

//         emit OrganizationRegistered(orgId, _name);
//     }

//     // Function to add daily carbon emission
//     function addEmission(uint256 _emission) external {
//         require(userAddresses[msg.sender] != 0, "User not registered");

//         uint256 userId = userAddresses[msg.sender];
//         users[userId].emissions[block.timestamp] = _emission;
//     }

//     // Function for individual user to buy credits against projects
//     function buyCredits(address _project, uint256 _amount) external {
//         require(userAddresses[msg.sender] != 0, "User not registered");
//         require(organizations[organizationAddresses[_project]].projects[_project], "Project not listed");

//         uint256 userId = userAddresses[msg.sender];
//         users[userId].credits[_project] += _amount;
//         carbonToken.transferFrom(msg.sender, address(this), _amount); // Transfer tokens from user to contract

//         emit CreditsBought(msg.sender, _project, _amount);
//     }

//     // Function for individual user to sell credits
//     function sellCredits(address _project, uint256 _amount) external {
//         require(userAddresses[msg.sender] != 0, "User not registered");
//         require(users[userAddresses[msg.sender]].credits[_project] >= _amount, "Insufficient credits");

//         uint256 userId = userAddresses[msg.sender];
//         users[userId].credits[_project] -= _amount;
//         carbonToken.transfer(msg.sender, _amount); // Transfer tokens from contract to user

//         emit CreditsSold(msg.sender, _project, _amount);
//     }

//     // Function to get user's daily emission for a given date
//     function getUserEmissionForDate(address _user, uint256 _date) external view returns (uint256) {
//         uint256 userId = userAddresses[_user];
//         return users[userId].emissions[_date];
//     }

//     // Function to get user's credits for a specific project
//     function getUserCreditsForProject(address _user, address _project) external view returns (uint256) {
//         uint256 userId = userAddresses[_user];
//         return users[userId].credits[_project];
//     }

//     // Function to get emissions from a specific date range
//     function getEmissionsFromDateRange(address _user, uint256 _fromDate, uint256 _toDate) external view returns (uint256) {
//         require(_fromDate <= _toDate, "Invalid date range");
//         require(userAddresses[_user] != 0, "User not registered");

//         uint256 userId = userAddresses[_user];
//         uint256 totalEmissions = 0;

//         for (uint256 i = _fromDate; i <= _toDate; i++) {
//             totalEmissions += users[userId].emissions[i];
//         }

//         return totalEmissions;
//     }
// }
