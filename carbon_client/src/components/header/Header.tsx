import { useNavigate } from "react-router-dom";
import "./Header.css";
import avatar from "../../assets/avatar.png";
import { Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { UtilityContext } from "../../context/Utility.context";
import { UtilityContextType } from "../../types/UtilityContext.type";
import { ContractDetailsType } from "../../types/ContractDetails.type";
import { Contract } from "ethers";
import { HeaderType } from "../../types/Header.type";
import logo from "../../assets/logo.svg";
import { useSmartContract } from "../../custom_hooks/useSmartContract";

export const Header = ({ isLoggedIn = false }: HeaderType) => {
  const { connectWallet, contractDetails } =
    useContext<UtilityContextType>(UtilityContext);
  const { contract } = contractDetails;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { callSmartContractMethod } = useSmartContract();
  const navigate = useNavigate();

  const login = async (contract: Contract | null) => {
    if (contract) {
      const {
        status,
        data = "",
        error = "",
      } = await callSmartContractMethod(contract.loginUser);
      if (status == "SUCCESS" && data) {
        navigate("/dashboard/home");
      } else {
        console.log(error);
      }
    }
  };

  const checkAndLogin = async () => {
    if (!contractDetails.contract) {
      const { contract }: ContractDetailsType = await connectWallet();
      await login(contract);
    } else {
      await login(contract);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToHome = () => {
    if (isLoggedIn) {
      navigate("/dashboard/home");
    } else {
      navigate("/");
    }
  };

  const goToOffset = () => {
    navigate("/dashboard/offset");
  };

  const goToReports = () => {
    navigate("/dashboard/reports");
  };

  const goToCalculator = () => {
    navigate("/dashboard/calculator");
  };
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = () => {
    navigate("/");
  };

  return (
    <>
      <div className="header_container">
        <div className="header_wrapper">
          <div className="logo" onClick={goToHome}>
            <img src={logo} className="logo_img" alt="logo" />
            EcoTrack
          </div>
          <div className="nav_bar">
            {isLoggedIn ? (
              <>
                <div className="nav_item" onClick={goToHome}>
                  Home
                </div>
                <div className="nav_item" onClick={goToReports}>
                  Reports
                </div>
                <div className="nav_item" onClick={goToOffset}>
                  Offset
                </div>
                <div className="nav_item" onClick={goToCalculator}>
                  Calculator
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <div className="profile" onClick={handleClick}>
                <div className="header_user_name">Hello {"User"}</div>
                <div className="header_profile_pic_container">
                  <img className="header_profile_pic" src={avatar} />
                </div>
              </div>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={onLogOut}>Log Out</MenuItem>
                {/* <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleClose}>Logout</MenuItem> */}
              </Menu>
            </>
          ) : (
            <div className="action_bar">
              <div className="action_item" onClick={checkAndLogin}>
                Login
              </div>
              <div
                className="action_item action_item_register"
                onClick={goToRegister}
              >
                Register
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
