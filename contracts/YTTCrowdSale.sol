// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MintToken.sol";
import "./Refund.sol";

contract YTTCrowdSale is Ownable{
  address public token;
  address payable public wallet;
  uint256 public rate;
  uint256 public totalFundedInWei;
  uint256 public hardCap; // Maximum amount to be funded
  uint256 public investorMinCap = 10 ** 15; // Minimum ether each individual can spend to purchase tokens
  uint256 public investorMaxCap = 10 ** 18; // Maximum ether each individual can spend to purchase tokens
  uint256 public openingTime;
  uint256 public closingTime;
  uint256 public goal;
  bool public isCrowdsaleFinished;

  Refund public refundVault;

  mapping (address => uint256) public buyers;

  event BuyTokens(address _msgSender, address _buyer, uint256 _fundingAmount, uint256 _tokenAmount);

  /**
   * @dev checks if the given parameters are valid
   * @param _wallet account address to which the funded ether is transfered
   * @param _rate amount of tokens to be minted per ether
   * @param _token token to mint
   */
  modifier validInitValues(address _wallet, uint256 _rate, address _token, uint256 _openingTime, uint256 _closingTime, uint256 _goal, uint256 _hardCap){
    require(_rate > 0, "Token rate should be bigger than 0");
    require(_wallet != address(0), "Wallet address is not provided");
    require(_token != address(0), "Token address is not provided");
    require(_openingTime >= block.timestamp, "Current time is less than block's latest time");
    require(_closingTime >= _openingTime, "closing time is less than opening time");
    require(_goal <= _hardCap);
    _;  
  }

  modifier onlyWhileOpen() {
    require(block.timestamp >= openingTime && block.timestamp <= closingTime, "it is not valid time");

    _;
  }

  /**
   * @dev constructor inits the vairables
   * @param _wallet account address to which the funded ether is transfered
   * @param _rate amount of tokens to be minted per ether
   * @param _token token to mint
   * @param _hardCap maximum amount of fund
   */
  constructor(address payable _wallet, uint256 _rate, address _token, uint256 _hardCap, uint256 _openingTime, uint256 _closingTime, uint256 _goal) validInitValues(_wallet, _rate, _token, _openingTime, _closingTime, _goal, _hardCap){
    wallet = _wallet;
    rate = _rate;
    token = _token;
    hardCap = _hardCap;
    openingTime = _openingTime;
    closingTime = _closingTime;
    refundVault = new Refund(wallet);
    goal = _goal;
  }

  /**
   * @dev allows buyer to buy tokens 
   * @param _buyer address of token buyer
   */
  function buyTokens(address _buyer) public payable onlyWhileOpen{
    uint256 receivedValue = msg.value;
    // check buyer address and received ether is valid
    require(_buyer != address(0) && receivedValue != 0, "not correct value");
    // check if total funded is not exceeding hardcap
    require(hardCap >= totalFundedInWei + receivedValue, "exceeding harcap");
    // chekc if each individual's cap is in range
    uint256 currentFundedValue = buyers[_buyer];
    uint256 newFundedValue = currentFundedValue + receivedValue;
    require(newFundedValue >= investorMinCap && newFundedValue <= investorMaxCap, "cannot purchase more");

    buyers[_buyer] = newFundedValue;
    uint256 numberOfTokensToMint = calculateAmountToken(receivedValue);
    totalFundedInWei += receivedValue;
    MintToken(token).mint(_buyer, numberOfTokensToMint);
    //wallet.transfer(msg.value);
    refundVault.deposit{value: msg.value}(msg.sender);
  }

  /**
   * @dev calculate the amount of token based on wei received
   * @param _receivedValue received wei
   * @return uint256 amount of token
   */
  function calculateAmountToken(uint256 _receivedValue) internal view returns (uint256){
    return rate * _receivedValue;
  }

  /**
   * @dev checks if the funds reach the cap
   * @return bool whether funds reach the cap
   */
  function hasReachedCap() public view returns (bool){
    return totalFundedInWei >= hardCap;
  }

  /**
   * @dev checks if the individual reach the cap
   * @param _buyer address of buyer
   * @return bool whether funds reach the cap
   */
  function hasIndividualReachedCap(address _buyer) public view returns (bool){
    return buyers[_buyer] >= investorMaxCap;
  }

  /**
   * @dev checks if the current time passed the closing time
   * @return bool whether current time passed the closing time
   */
  function isClosed() public view returns (bool){
    return block.timestamp > closingTime;
  }

  /**
   * @dev checks if funds reach the goal
   * @return bool true if it reaches the goal
   */
  function hasReachedGoal() public view returns (bool) {
    return totalFundedInWei >= goal;
  }

  /**
   * @dev if goal has not been reached and crowdsale fininshed, buyer can claim refunds
   */
  function claimRefund() public {
    require(!hasReachedGoal(), "Goal has been reached so you cannot get refund");
    require(isCrowdsaleFinished);

    refundVault.refund(payable(msg.sender));
  }

  /**
   * @dev closes the crowdsale
   */
  function finishCrowdsale() public onlyOwner {
    require(!isCrowdsaleFinished);

    if(hasReachedGoal()){
      refundVault.closeRefund();
      MintToken(token).unLockTransfer();
    } else {
      refundVault.enableRefund();
    }

    isCrowdsaleFinished = true;
  }
}