// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

abstract contract MintToken is ERC20, Ownable {
  /**
   * @dev mint tokens to address
   * @param _to address which token is minted to
   * @param _amount number of token minted
   */
  function mint(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
  }
}