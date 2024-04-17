import { ethers } from "hardhat";
import { Functionality } from "../typechain-types";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

// npx hardhat test

const emissions = [
  {
    category: "Fuel Consumption",
    value_type: "number",
    emission_value: 4n,
    factor_name: "petrol",
    value: "2",
  },
  {
    category: "Fuel Consumption",
    value_type: "number",
    emission_value: 5n,
    factor_name: "diesel",
    value: "2",
  },
  {
    category: "Fuel Consumption",
    value_type: "number",
    emission_value: 4n,
    factor_name: "lpg/cng",
    value: "2",
  },
  {
    category: "Fuel Consumption",
    value_type: "number",
    emission_value: 5n,
    factor_name: "coal",
    value: "2",
  },
  {
    category: "Energy Consumption",
    value_type: "number",
    emission_value: 141n,
    factor_name: "electricity",
    value: "200",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 12n,
    factor_name: "flights",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 0n,
    factor_name: "trains",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 1n,
    factor_name: "metro",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 5n,
    factor_name: "bus",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 3n,
    factor_name: "e_bus",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 14n,
    factor_name: "car",
    value: "100",
  },
  {
    category: "Travel",
    value_type: "number",
    emission_value: 10n,
    factor_name: "e_car",
    value: "100",
  },
  {
    category: "Food Habits",
    value_type: "number",
    emission_value: 10n,
    factor_name: "meal",
    value: "5",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
  {
    category: "",
    emission_value: 0n,
    factor_name: "",
    value: "",
    value_type: "",
  },
];

describe("Gas Consumption", function () {
  let contract: Functionality;
  async function deployContract() {
    const accounts = await ethers.getSigners();

    const instance = await ethers.getContractFactory("Functionality");
    contract = await instance.deploy();
    return {
      contract,
      users: accounts.slice(1, 4),
      orgUser: accounts.slice(4, 7),
    };
  }

  describe("Calling Each Function ", function () {
    it("Should call the functions", async function () {
      const { contract, users, orgUser } = await loadFixture(deployContract);
      const registerUserTx = await contract.connect(users[0]).registerUser({
        first_name: "User",
        last_name: "Name",
        email: "user@gmail.com",
        date_of_birth: new Date(1997, 10, 5).getTime(),
        gender: "Male",
      });

      await registerUserTx.wait();
      const loginUser = await contract.connect(users[0]).loginUser();
      expect(loginUser).to.be.true;

      const registerOrganizationTx = await contract
        .connect(orgUser[0])
        .registerOrganization({
          name: "Organization",
          email: "organization@gmail.com",
        });
      await registerOrganizationTx.wait();

      const loginOrg = await contract.connect(orgUser[0]).loginUser();
      expect(loginOrg).to.be.true;

      const addProjectTx = await contract.connect(orgUser[0]).addProject({
        name: "Project",
        creditQuantity: 100,
        creditType: "ABC",
        description: "Project with 100 credits of type ABC.",
      });
      await addProjectTx.wait();

      const editProjectTx = await contract.connect(orgUser[0]).editProject({
        id: 1,
        name: "Project",
        creditQuantity: 200,
        creditType: "ABC",
        description:
          "Project with 100 credits of type ABC from Org Organization.",
        status: "ACTIVE",
      });
      await editProjectTx.wait();

      const addEmissionsTx = await contract.connect(users[0]).addEmission({
        date: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).getTime(),
        emissions,
      });
      await addEmissionsTx.wait();

      const totalEmission = await contract
        .connect(users[0])
        .getTotalEmissions();
      expect(totalEmission).to.equal(214);

      const projects = await contract.connect(users[0]).getProjects(1);
      expect(projects[0][1]).to.equal("Project");

      const emissionsTx = await contract.connect(users[0]).fetchEmissions({
        from: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).getTime(),
        to: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).getTime(),
      });
      expect(Number(emissionsTx[0][0])).to.equal(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ).getTime()
      );

      const addProjectToCartTx = await contract
        .connect(users[0])
        .addProjectToCart({
          projectId: 1,
          quantity: 5,
        });
      addProjectToCartTx.wait();

      const fetchCartTx = await contract.connect(users[0]).fetchCart(0);
      expect(fetchCartTx[0][0]).to.equal("ABC");

      const makeCartEmptyTx = await contract.connect(users[0]).makeCartEmpty({
        projectId: 1,
      });
      makeCartEmptyTx.wait();

      const fetchCartTx2 = await contract.connect(users[0]).fetchCart(0);
      expect(fetchCartTx2[0][1]).to.equal(0);

      const addProjectToCartAgainTx = await contract
        .connect(users[0])
        .addProjectToCart({
          projectId: 1,
          quantity: 5,
        });
      addProjectToCartAgainTx.wait();
      const fetchCartTx3 = await contract.connect(users[0]).fetchCart(0);
      expect(fetchCartTx3[0][1]).to.equal(5);

      const buyCreditsFromCartTx = await contract
        .connect(users[0])
        .buyCreditsFromCart({ value: 500 });
      await buyCreditsFromCartTx.wait();

      const creditCount = await contract
        .connect(users[0])
        .getTotalCreditCount();
      expect(creditCount).to.equal(5);

      const getPortfolio = await contract.connect(users[0]).getPortfolio(0);
      expect(getPortfolio[0][1]).to.equal(5);

      const transactions = await contract.connect(users[0]).getTransactionBy(0);
      expect(transactions[0][2]).to.equal(users[0].address);
    });
  });
});
