pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// mock class using ERC20
contract ERC20Mock is ERC20 {
    constructor(
      address initialAccount, uint256 initialBalance, string memory _name, string memory _symbol
    ) ERC20(_name, _symbol) public {
      _mint(initialAccount, initialBalance);
    }
}
