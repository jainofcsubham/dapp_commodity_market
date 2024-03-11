import React, { useState } from "react";
import "./Register.css"; // Import your CSS file
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  connectWallet: any;
  state: {
    provider?: ethers.BrowserProvider | null;
    signer?: ethers.JsonRpcSigner | null;
    contract?: ethers.Contract | null;
  };
}

export const Register = ({ state }: RegisterProps) => {
  const { contract, signer } = state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    name: "",
    contactNumber: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Your custom logic here
    // Access form data from the state
    const { name, contactNumber } = formData;
    const address = signer?.getAddress();
    if (contract) {
      const tnx = await contract.registerUser(name, address, contactNumber);
      console.log(tnx);
      navigate("/login");
    }
    // Call your function or perform any necessary actions
    console.log(
      "Form submitted! Name:",
      name,
      "Contact Number:",
      contactNumber
    );
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="contactNumber">Contact Number:</label>
        <input
          type="tel"
          id="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          name="contactNumber"
          placeholder="Enter your contact number"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
