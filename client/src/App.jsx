import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import Navbar from "./component/Navbar";
import { address, abi } from "./contract/Crowdsale";
import {
  address as tokenAddress,
  abi as tokenABI,
} from "./contract/ERC20Token";
import Timer from "./component/Timer";
import Goal from "./component/Goal";
import Container from "@mui/material/Container";
import Info from "./component/Info";
import Fund from "./component/Fund";

function App() {
  const [count, setCount] = useState(0);
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});
  const [account, setAccount] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [crowdSaleContract, setCrowdSaleContract] = useState({});
  const [tokenContract, setTokenContract] = useState({});
  const [hasStarted, setHasStarted] = useState(false);

  const connectToWallet = async () => {
    await provider.send("eth_requestAccounts", []);
    const _signer = provider.getSigner();
    const _account = await _signer.getAddress();
    const balance = await provider.getBalance(_account);
    setSigner(_signer);
    setAccount(_account);
    setIsLogin(true);

    console.log(_account);
    console.log(ethers.utils.formatEther(balance));
  };

  const checkIfReachedGoal = async () => {
    const hasReach = await crowdSaleContract.hasReachedGoal();
    setHasReachedGoal(hasReach);
  };

  useEffect(() => {
    const getProvdierAndContract = async () => {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(address, abi, _provider.getSigner());
      const _tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI,
        _provider
      );
      setProvider(_provider);
      setCrowdSaleContract(contract);
      setTokenContract(_tokenContract);
    };
    getProvdierAndContract();
  }, []);

  useEffect(() => {
    if (isOver) {
      checkIfReachedGoal();
    }
  }, [isOver]);
  return (
    <>
      <Navbar
        connectToWallet={connectToWallet}
        isLogin={isLogin}
        account={account}
      />
      <Container
        maxWidth='md'
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Timer
          crowdSaleContract={crowdSaleContract}
          hasStarted={hasStarted}
          setHasStarted={setHasStarted}
          setIsOver={setIsOver}
          isOver={isOver}
        />
        <Goal crowdSaleContract={crowdSaleContract} />
        <Fund
          crowdSaleContract={crowdSaleContract}
          isLogin={isLogin}
          hasStarted={hasStarted}
          account={account}
          tokenContract={tokenContract}
          isOver={isOver}
          hasReachedGoal={hasReachedGoal}
        />
        <Info crowdSaleContract={crowdSaleContract} />
      </Container>
    </>
  );
}

export default App;
