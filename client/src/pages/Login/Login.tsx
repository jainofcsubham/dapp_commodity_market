import React from "react";
import "./Login.css"; // Import your CSS file
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  connectWallet: any;
  state: {
    provider?: ethers.BrowserProvider;
    signer?: ethers.JsonRpcSigner;
    contract?: ethers.Contract;
  };
}

export const Login = ({ connectWallet, state }: LoginProps) => {
  const { contract } = state;
  const navigate = useNavigate();
  const login = async () => {
    // await connectWallet();
    if (contract) {
      const transaction = await contract.loginUser();
      if(transaction){
        navigate("/dashboard");
      }
    }
  };

  const register = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Connect with MetaMask</h2>
      <div className="button-interact">
        {contract ? (
          <>
            <button className="login-button" onClick={login}>
              Login
            </button>

            <button className="login-button" onClick={register}>
              Sign up
            </button>
          </>
        ) : (
          <>
          <button className="login-button" onClick={connectWallet}>
              Connect wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};
