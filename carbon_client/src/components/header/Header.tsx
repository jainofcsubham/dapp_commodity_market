import { useNavigate } from "react-router-dom";
import "./Header.css";
import avatar from "../../assets/avatar.png";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header = ({ isLoggedIn = false }: HeaderProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
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

  const goToGroups = () => {
    navigate("/dashboard/groups");
  };

  const goToCalculator = () => {
    navigate("/dashboard/calculator");
  };
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation()
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = () => {
    navigate("/")
  }

  return (
    <>
      <div className="header_container">
        <div className="header_wrapper">
          <div className="logo" onClick={goToHome}>
            CARBONCALC
          </div>
          <div className="nav_bar">
            {isLoggedIn ? (
              <>
                <div className="nav_item" onClick={goToHome}>
                  Home
                </div>
                <div className="nav_item" onClick={goToGroups}>
                  Groups
                </div>
                <div className="nav_item" onClick={goToCalculator}>
                  Calculator
                </div>
                {/* <div className="nav_item">FAQ</div>
                <div className="nav_item">Contact</div> */}
              </>
            ) : (
              <></>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <div className="profile" onClick={handleClick}>
                <div className="header_user_name">Hello User</div>
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
              <div className="action_item" onClick={goToLogin}>
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
