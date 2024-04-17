import { ethers } from "hardhat";
import { Functionality } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

// npx hardhat test

describe("Login", function () {
  let contract: Functionality;
  const load = 18;
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const accounts = await ethers.getSigners();
    const owner = accounts[0];
    const temp_user = accounts[1];
    const users = accounts.slice(2, 2 + load);

    const instance = await ethers.getContractFactory("Functionality");
    contract = await instance.deploy();

    let count = 1;
    users.forEach(async (user) => {
      await contract
        .connect(user)
        .registerOrganization({
          name: `User ${count}`,
          email: `user${count}@gmail.com`,
        });
      count++;
    });
  }

  describe("Registering", function () {
    it("Should register and login an user", async function () {
      const _res = await loadFixture(deployContract);
    });
  });

  deployContract();
});
