import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import Navbar from "./component/Navbar";
import { address, abi } from "./contract/Crowdsale";
import Timer from "./component/Timer";
import Goal from "./component/Goal";
import Container from "@mui/material/Container";

function App() {
  const [count, setCount] = useState(0);
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});
  const [account, setAccount] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [crowdSaleContract, setCrowdSaleContract] = useState({});

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

  useEffect(() => {
    const getProvdierAndContract = async () => {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(address, abi, _provider);
      setProvider(_provider);
      setCrowdSaleContract(contract);
    };
    getProvdierAndContract();
  }, []);
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
        <Timer crowdSaleContract={crowdSaleContract} />
        <Goal crowdSaleContract={crowdSaleContract} />
      </Container>
    </>
  );
}

export default App;
