import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import Navbar from "./component/Navbar";

function App() {
  const [count, setCount] = useState(0);
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});
  const [account, setAccount] = useState("");
  const [isLogin, setIsLogin] = useState(false);

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
    const getProvdier = async () => {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);

      setProvider(_provider);
    };
    getProvdier();
  }, []);
  return (
    <Navbar
      connectToWallet={connectToWallet}
      isLogin={isLogin}
      account={account}
    />
  );
}

export default App;
