import "./App.css";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Web3 from "web3";
import YTTCrowdSale from "./contracts/YTTCrowdSale.json";

function App() {
  const [yttCrowdSale, setYttCrowdSale] = useState({});
  const [web3, setWeb3] = useState(null);
  const [data, setData] = useState({});
  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    return provider;
  };
  const connectToWallet = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        let account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, "ether"); //Convert balance to wei

        if (userAccount.length === 0) {
          console.log("Please connect to meta mask");
        }
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        const yttCrowdSaleNetworkData = await YTTCrowdSale.networks[networkId];
        const _yttCrowdSale = new web3.eth.Contract(
          YTTCrowdSale.abi,
          yttCrowdSaleNetworkData.address
        );
        console.log(_yttCrowdSale);
        let token = await _yttCrowdSale.methods.token().call();
        let rate = await _yttCrowdSale.methods.rate().call();
        let totalFundedInWei = await _yttCrowdSale.methods
          .totalFundedInWei()
          .call();
        let hardCap = await _yttCrowdSale.methods.hardCap().call();
        let investorMinCap = await _yttCrowdSale.methods
          .investorMinCap()
          .call();
        let investorMaxCap = await _yttCrowdSale.methods
          .investorMaxCap()
          .call();
        let openingTime = await _yttCrowdSale.methods.openingTime().call();
        let closingTime = await _yttCrowdSale.methods.closingTime().call();

        let goal = await _yttCrowdSale.methods.goal().call();
        setData({
          token,
          rate,
          totalFunded: web3.utils.fromWei(totalFundedInWei, "ether"),
          hardCap: web3.utils.fromWei(hardCap, "ether"),
          investorMinCap: web3.utils.fromWei(investorMinCap, "ether"),
          investorMaxCap: web3.utils.fromWei(investorMaxCap, "ether"),
          openingTime,
          closingTime,
          goal: web3.utils.fromWei(goal, "ether"),
        });
      }
    } catch (err) {
      console.log(
        "There was an error fetching your accounts. Make sure your Ethereum client is configured correctly."
      );
    }
  };

  const initWeb3 = async () => {};
  return (
    <div className='App'>
      <Button variant='contained' onClick={connectToWallet}>
        지갑연결
      </Button>
      <p>Token 주소: {data.token}</p>
      <p>1 ETH = {data.rate} YTT</p>
      <p>현재 총 모금액: {data.totalFunded} ETH</p>
      <p>최대 모금액: {data.hardCap} ETH</p>
      <p>최소 구매 금액: {data.investorMinCap} ETH</p>
      <p>최대 구매 금액: {data.investorMaxCap} ETH</p>
      <p>ICO 시작 시간: {data.openingTime}</p>
      <p>ICO 종료 시간: {data.closingTime}</p>
      <p>목표 금액: {data.goal} ETH</p>
    </div>
  );
}

export default App;
