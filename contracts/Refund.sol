// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Refund is Ownable{
  enum State {Open, Close, Refund}

  mapping(address => uint256) public deposited;
  address payable public wallet;
  State public state;

  event RefundClosed();
  event RefundEnabled();
  event Refunded(address to, uint256 amount);

  constructor(address payable _wallet) {
    wallet = _wallet;
    state = State.Open;
  }

  /**
   * @dev keep tracks of each buyer's funds
   * @param _buyer address of buyer
   */
  function deposit(address _buyer) onlyOwner public payable{
    require(state == State.Open);
    deposited[_buyer] += msg.value;
  }

  /**
   * @dev closes the refund contract and the owner claims the funds
   */
  function closeRefund() onlyOwner public {
    require(state == State.Open);
    state = State.Close;
    wallet.transfer(address(this).balance);

    emit RefundClosed();
  }

  /**
   * @dev change current state to Refund
   */
  function enableRefund() onlyOwner public {
    require(state == State.Open);
    state = State.Refund;
    emit RefundEnabled();
  }

  /**
   * @dev each individual claims their refunds
   * @param _buyer address of buyer
   */
  function refund(address payable _buyer) public {
    require(state == State.Refund);
    uint256 _deposited = deposited[_buyer];
    deposited[_buyer] = 0;
    _buyer.transfer(_deposited);
    emit Refunded(_buyer, _deposited);
  }
}