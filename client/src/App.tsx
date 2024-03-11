import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import {
  Route,
  Routes,
} from "react-router-dom";
import { ethers } from "ethers";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import abi from "./contract/Functionality.json"
import { Register } from "./pages/Register/Register";
export const App = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<bigint>(0n);
  const [state,setState] = useState<{
    provider ?: ethers.BrowserProvider,
    signer ?:ethers.JsonRpcSigner,
    contract ?: ethers.Contract
  }>({})

  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.request) {
      const contractAddress = "0x2C4b91a990De2975DA46fF8DbC5Eb33fc149ed35"
      const contractABI = abi.abi
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });


        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress,contractABI,signer);
        const balance = await provider.getBalance(address);
        setUserAddress(address);
        setUserBalance(balance);
        setState({contract,signer,provider});
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not found.");
    }
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Login connectWallet={connectWallet} state={state} />} />
        <Route path="/dashboard" element={<Dashboard balance={userBalance} address={userAddress} />} />
        <Route path="/register" element={<Register connectWallet={connectWallet} state={state} />} />
      </Routes>
    </>
  );
};
