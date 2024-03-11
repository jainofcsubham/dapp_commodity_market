import React from 'react'
import './Dashboard.css'; // Import your CSS file

interface DashboardProps {
    address : string,
    balance : bigint

}

export const Dashboard = ({address,balance}:DashboardProps) => {
    return (
        <div className="dashboard-container">
          <h1 className="dashboard-heading">Dashboard</h1>
          {address && <p className="dashboard-info">Ethereum Address: {address}</p>}
          {Number(balance) && <p className="dashboard-info">Balance: {Number(balance)} Wei</p>}
        </div>
      );
}
