// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MintToken.sol";

contract YTTCrowdSale {
  address public token;
  address payable public wallet;
  uint256 public rate;
  uint256 public totalFundedInWei;

  event BuyTokens(address _msgSender, address _buyer, uint256 _fundingAmount, uint256 _tokenAmount);

  /**
   * @dev checks if the given parameters are valid
   * @param _wallet account address to which the funded ether is transfered
   * @param _rate amount of tokens to be minted per ether
   * @param _token token to mint
   */
  modifier validInitValues(address _wallet, uint256 _rate, address _token){
    require(_rate > 0, "Token rate should be bigger than 0");
    require(_wallet != address(0), "Wallet address is not provided");
    require(_token != address(0), "Token address is not provided");
    _;
  }

  /**
   * @dev constructor inits the vairables
   * @param _wallet account address to which the funded ether is transfered
   * @param _rate amount of tokens to be minted per ether
   * @param _token token to mint
   */
  constructor(address payable _wallet, uint256 _rate, address _token) validInitValues(_wallet, _rate, _token){
    wallet = _wallet;
    rate = _rate;
    token = _token;
  }

  /**
   * @dev allows buyer to buy tokens 
   * @param _buyer address of token buyer
   */
  function buyTokens(address _buyer) public payable {
    uint256 receivedValue = msg.value;
    require(_buyer != address(0) && receivedValue != 0);
    uint256 numberOfTokensToMint = calculateAmountToken(receivedValue);
    totalFundedInWei += receivedValue;
    MintToken(token).mint(_buyer, numberOfTokensToMint);
    wallet.transfer(msg.value);
  }

  /**
   * @dev calculate the amount of token based on wei received
   * @param _receivedValue received wei
   * @return uint256 amount of token
   */
  function calculateAmountToken(uint256 _receivedValue) internal view returns (uint256){
    return rate * _receivedValue;
  }
}