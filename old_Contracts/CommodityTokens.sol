// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @custom:security-contact soumikkvb&gmail.com
contract CommodityTokens is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory Name, string memory Sym) ERC20(Name, Sym) {
        _mint(msg.sender, 1000);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function transfer(address from, address to, uint256 amount) public returns (bool) {
        // address sender = _msgSender();
        _transfer(from, to, amount * 10 ** decimals());
        return true;
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function burn(address from, uint256 amount) public virtual {
        require(balanceOf(from) > amount, "Not enough Tokens !!");
        _burn(from, amount);
    }

    function balanceChecker(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}