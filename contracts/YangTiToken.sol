// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MintToken.sol";

contract YangTiToken is MintToken {
  /**
   * @dev constructor create YangTiToken
   * @param _name token name
   * @param _symbol token symbol
   */
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol){}
}