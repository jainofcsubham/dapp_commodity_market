import { ethers } from "hardhat";
import { Functionality } from "../typechain-types";
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

describe("Stress Testing", function () {
  let contract: Functionality;
  async function deployContract() {
    const accounts = await ethers.getSigners();

    const instance = await ethers.getContractFactory("Functionality");
    contract = await instance.deploy();
    return {
      contract,
      users: accounts.slice(1, 6),
      orgUser: accounts.slice(6, 11),
    };
  }

  async function printBalance(accounts:string[]) {
    const res = await Promise.all(accounts.map(each => {
        return ethers.provider.getBalance(each);
    }))
    res.forEach((each,index) => {
        console.log(`${accounts[index]}:- ${ethers.formatEther(10000000000000000000000n - each)}`)
    })
  }

  describe("Calling Each Function ", function () {
    it("Should call the functions", async function () {
      const { contract, users, orgUser } = await loadFixture(deployContract);
      

      const registerUserPromises = users.map((user, index) =>
        contract.connect(user).registerUser({
          first_name: `User${index + 1}`,
          last_name: `Name${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          date_of_birth: new Date(1996, 10, index + 1).getTime(),
          gender: "Male",
        })
      );
      const registerUserTx = await Promise.all(registerUserPromises);
      const registerUserTxPromises = registerUserTx.map((each) => each.wait());
      await Promise.all(registerUserTxPromises);

      const registerOrgPromises = orgUser.map((user, index) =>
        contract.connect(user).registerOrganization({
          name: `Org ${index + 1}`,
          email: `org${index + 1}@gmail.com`,
        })
      );
      const registerOrgTx = await Promise.all(registerOrgPromises);
      const registerOrgTxPromises = registerOrgTx.map((each) => each.wait());
      await Promise.all(registerOrgTxPromises);

      let addProjectPromises: any[] = [];
      orgUser.forEach((user, index) => {
        Array(10)
          .fill(null)
          .forEach((_i, indexIn) => {
            addProjectPromises.push(
              contract.connect(user).addProject({
                name: `Project_${index + 1}_${indexIn + 1}`,
                creditQuantity: 100,
                creditType: "ABC",
                description: "Project with 100 credits of type ABC.",
              })
            );
          });
      });
      const addProjectTx = await Promise.all(addProjectPromises);
      const addProjectTxPromises = addProjectTx.map((each) => each.wait());
      await Promise.all(addProjectTxPromises);

      let count = 1;
      let editProjectPromises: any[] = [];
      orgUser.forEach((user, index) => {
        Array(10)
          .fill(null)
          .forEach((_i, indexIn) => {
            editProjectPromises.push(
              contract.connect(user).editProject({
                name: `Project_${index + 1}_${indexIn + 1}`,
                creditQuantity: 100,
                creditType: "ABC",
                id: count,
                description:
                  "Project with 100 credits of type ABC from Org Organization.",
                status: "ACTIVE",
              })
            );
            count = count + 1;
          });
      });
      const editProjectTx = await Promise.all(editProjectPromises);
      const editProjectTxPromises = editProjectTx.map((each) => each.wait());
      await Promise.all(editProjectTxPromises);

      let addEmissionPromises: any[] = [];
      users.forEach((user, index) => {
        Array(10)
          .fill(null)
          .forEach((_i, indexIn) => {
            addEmissionPromises.push(
                contract.connect(user).addEmission({
                    date: new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate() - indexIn
                    ).getTime(),
                    emissions,
                  })
            );
          });
      });
      const addEmissionTx = await Promise.all(addEmissionPromises);
      const addEmissionTxPromises = addEmissionTx.map((each) => each.wait());
      await Promise.all(addEmissionTxPromises);

      let addProjectToCartPromises: any[] = [];
      users.forEach((user, index) => {
        let projectCount  = 1;
        Array(5)
          .fill(null)
          .forEach((_i, indexIn) => {
            addProjectToCartPromises.push(
                contract.connect(user).addProjectToCart({
                   quantity : 10,
                   projectId : projectCount
                  })
            );
            projectCount = projectCount +1;
          });
      });
      const addProjectToCartTx = await Promise.all(addProjectToCartPromises);
      const addProjectToCartTxPromises = addProjectToCartTx.map((each) => each.wait());
      await Promise.all(addProjectToCartTxPromises);

      let makeCartEmptyPromises: any[] = [];
      users.forEach((user, index) => {
        let projectCount  = 1;
        Array(5)
          .fill(null)
          .forEach((_i, indexIn) => {
            makeCartEmptyPromises.push(
                contract.connect(user).makeCartEmpty({
                   projectId : projectCount
                  })
            );
            projectCount = projectCount +1;
          });
      });
      const makeCartEmptyTx = await Promise.all(makeCartEmptyPromises);
      const makeCartEmptyTxPromises = makeCartEmptyTx.map((each) => each.wait());
      await Promise.all(makeCartEmptyTxPromises);

      let addProjectToCartPromisesAgain: any[] = [];
      users.forEach((user, index) => {
        let projectCount  = 1;
        Array(5)
          .fill(null)
          .forEach((_i, indexIn) => {
            addProjectToCartPromisesAgain.push(
                contract.connect(user).addProjectToCart({
                   quantity : 10,
                   projectId : projectCount
                  })
            );
            projectCount = projectCount +1;
          });
      });
      const addProjectToCartAgainTx = await Promise.all(addProjectToCartPromisesAgain);
      const addProjectToCartAgainTxPromises = addProjectToCartAgainTx.map((each) => each.wait());
      await Promise.all(addProjectToCartAgainTxPromises);

      const buyCreditsFromCartPromises = users.map((user, _index) =>
        contract.connect(user).buyCreditsFromCart({value : 50})
      );
      const buyCreditsTx = await Promise.all(buyCreditsFromCartPromises);
      const buyCreditsTxPromises = buyCreditsTx.map((each) => each.wait());
      await Promise.all(buyCreditsTxPromises);
      printBalance(users.map(each => each.address));
      printBalance(orgUser.map(each => each.address));
    });
  });
});
