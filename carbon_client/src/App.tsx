import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import reactLogo from './assets/react.svg'
import { ethers } from "ethers";
import { useState } from "react";
import "./App.css";
import { UtilityContext } from "./context/Utility.context";
import abi from "./contract/Functionality.json";
import { CalculatePublic } from "./pages/calculator_public/CalculatePublic";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Landing } from "./pages/landing/Landing";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { ContractDetailsType } from "./types/ContractDetails.type";
import { BarContext } from "./context/Bar";
import { Alert, Snackbar } from "@mui/material";
import { SnackBarDetailsType } from "./types/SnackBarDetails.type";

const defaultErrorBarDetails: SnackBarDetailsType = {
  isOpen: false,
  note: "",
  type : "success"
};

export const App = () => {
  const [contractDetails, setContractDetails] = useState<ContractDetailsType>({
    contract: null,
    address: "",
    balance: BigInt(0),
  });

  const [snackBarDetails, setSnackBarDetails] = useState<SnackBarDetailsType>(
    defaultErrorBarDetails
  );

  const showBar = (note: string,type : "error" | "info" | "success" | "warning") => {
    setSnackBarDetails({ isOpen: true, note,type });
  };

  const hideErrorBar = () => {
    setSnackBarDetails(defaultErrorBarDetails);
  };
  const connectWallet = async () => {
    if (window.ethereum && window.ethereum.request) {
      const contractAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
      const contractABI = abi.abi;
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        // const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const balance = await provider.getBalance(address);
        const contractDetails: ContractDetailsType = {
          contract,
          address,
          balance,
        };
        setContractDetails(contractDetails);
        return contractDetails;
      } catch (error) {
        throw Error(`Error connecting to MetaMask:${error}`);
      }
    } else {
      throw Error(`Metamask not found.`);
    }
  };
  return (
    <>
      <UtilityContext.Provider
        value={{
          connectWallet,
          contractDetails,
        }}
      >
        <BarContext.Provider
          value={{
            showBar,
          }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/calculator" element={<CalculatePublic />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/forgot-password" element={<Calculator />} /> */}
            </Routes>
          </Router>
        </BarContext.Provider>
        <Snackbar
          open={snackBarDetails.isOpen}
          autoHideDuration={6000}
          onClose={hideErrorBar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={hideErrorBar}
            severity={snackBarDetails.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackBarDetails.note}
          </Alert>
        </Snackbar>
      </UtilityContext.Provider>
    </>
  );
};
