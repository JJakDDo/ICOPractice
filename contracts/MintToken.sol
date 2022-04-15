// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract MintToken is ERC20, Ownable {
  bool private isLocked = true;
  /**
   * @dev mint tokens to address
   * @param _to address which token is minted to
   * @param _amount number of token minted
   */
  function mint(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
  }

  function transfer(address to, uint256 amount) public virtual override returns (bool) {
    require(!isLocked, "cannot transfer token while it is locked!!");
    return super.transfer(to, amount);
  }

  function unLockTransfer() public onlyOwner {
    isLocked = false;
  }

  function lockTransfer() public onlyOwner {
    isLocked = true;
  }
}