import { ethers } from "hardhat";

async function main() {
  const [owner,from1,from2,from3] = await ethers.getSigners();
  const second =await ethers.getContractFactory("Second");
  const contract = await second.deploy();

  await contract.waitForDeployment()

  let sol = await contract.connect(from1).doProcess(5);
  console.log("The  value is ",Number(sol));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
