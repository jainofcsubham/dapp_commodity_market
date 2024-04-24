import { ethers } from "hardhat";
import abi from "../final_artifact.json";

const contractAddress = "0x4F503a8D6B683A2784Ec0C065860508abEC97b5a"; // Replace with your contract's deployed address

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function printBalance(accounts: string[]) {
  const res = await Promise.all(
    accounts.map((each) => {
      return ethers.provider.getBalance(each);
    })
  );
  res.forEach((each, index) => {
    console.log(
      `${accounts[index]}:- ${ethers.formatEther(
        10000000000000000000000n - each
      )}`
    );
  });
}

//npx hardhat run scripts/stress_testing.ts --network sepolia
async function main() {
  const allUsers = await ethers.getSigners();
  const provider = ethers.provider;
  const contract: any = new ethers.Contract(
    contractAddress,
    abi.abi,
    allUsers[0]
  );
  const users = allUsers.slice(0, 3);
  const userNonce: Record<string, number> = {};
  const orgUser = allUsers.slice(3, 6);
  const orgNonce: Record<string, number> = {};

  console.log("Fetching User Nonce Started");
  const nonceUserPromises: any[] = [];
  users.forEach((user) => {
    nonceUserPromises.push(provider.getTransactionCount(user.address));
  });
  const res = await Promise.all(nonceUserPromises);
  res.map((each, index) => {
    userNonce[users[index].address] = each;
  });
  console.log(userNonce, "User Nonce");
  console.log("Fetching User Nonce Done.");

  console.log("Fetching Org Nonce Started");
  const nonceOrgPromises: any[] = [];
  orgUser.forEach((user) => {
    nonceOrgPromises.push(provider.getTransactionCount(user.address));
  });
  const resOrg = await Promise.all(nonceOrgPromises);
  resOrg.map((each, index) => {
    orgNonce[orgUser[index].address] = each;
  });
  console.log(orgNonce, "User Nonce");
  console.log("Fetching Org Nonce Done.");

  console.log("Register User Started");
  const registerUserPromises: any[] = [];
  users.forEach((user, index) => {
    registerUserPromises.push(
      contract.connect(user).registerUser(
        {
          first_name: `User${index + 1}`,
          last_name: `Name${index + 1}`,
          email: `user${index + 1}@gmail.com`,
          date_of_birth: new Date(1996, 10, index + 1).getTime(),
          gender: "Male",
        },
        { nonce: userNonce[user.address] }
      )
    );
    userNonce[user.address] = userNonce[user.address] + 1;
  });
  const registerUserTx = await Promise.all(registerUserPromises);
  const registerUserTxPromises = registerUserTx.map((each) => each.wait());
  await Promise.all(registerUserTxPromises);
  console.log(userNonce, "User Nonce");
  console.log("Register User Done");

  await delay(2000);

  console.log("Register Org Started");
  const registerOrgPromises: any[] = [];
  orgUser.forEach((user, index) => {
    registerOrgPromises.push(
      contract.connect(user).registerOrganization(
        {
          name: `Org ${index + 1}`,
          email: `org${index + 1}@gmail.com`,
        },
        { nonce: orgNonce[user.address] }
      )
    );
    orgNonce[user.address] = orgNonce[user.address] + 1;
  });
  const registerOrgTx = await Promise.all(registerOrgPromises);
  const registerOrgTxPromises = registerOrgTx.map((each) => each.wait());
  await Promise.all(registerOrgTxPromises);
  console.log(orgNonce, "User Nonce");
  console.log("Register Org Done");

  await delay(10000);

  console.log("Add Project Started");
  let addProjectPromises: any[] = [];
  orgUser.forEach((user, index) => {
    Array(1)
      .fill(null)
      .forEach((_i, indexIn) => {
        addProjectPromises.push(
          contract.connect(user).addProject(
            {
              name: `Project_${index + 1}_${indexIn + 1}`,
              creditQuantity: 1000,
              creditType: "ABC",
              description: "Project with 100 credits of type ABC.",
            }
            // { nonce: orgNonce[user.address] }
          )
        );
        orgNonce[user.address] = orgNonce[user.address] + 1;
      });
  });
  const addProjectTx = await Promise.all(addProjectPromises);
  const addProjectTxPromises = addProjectTx.map((each) => each.wait());
  await Promise.all(addProjectTxPromises);
  console.log("Add Project Done");

  await delay(2000);

//   console.log("Edit Project Started");
//   let count = 1;
//   let editProjectPromises: any[] = [];
//   orgUser.forEach((user, index) => {
//     Array(1)
//       .fill(null)
//       .forEach((_i, indexIn) => {
//         editProjectPromises.push(
//           contract.connect(user).editProject(
//             {
//               name: `Project_${index + 1}_${indexIn + 1}`,
//               creditQuantity: 1000,
//               creditType: "ABC",
//               id: count,
//               description:
//                 "Project with 100 credits of type ABC from Org Organization.",
//               status: "ACTIVE",
//             }
//             // { nonce: orgNonce[user.address] }
//           )
//         );
//         orgNonce[user.address] = orgNonce[user.address] + 1;
//         count = count + 1;
//       });
//   });
//   const editProjectTx = await Promise.all(editProjectPromises);
//   const editProjectTxPromises = editProjectTx.map((each) => each.wait());
//   await Promise.all(editProjectTxPromises);
//   console.log("Edit Project Done");

  await delay(2000);

  console.log("Add Emissions Started");
  let addEmissionPromises: any[] = [];
  users.forEach((user, index) => {
    Array(1)
      .fill(null)
      .forEach((_i, indexIn) => {
        addEmissionPromises.push(
          contract.connect(user).addEmission(
            {
              date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - indexIn
              ).getTime(),
              emissions,
            }
            // { nonce: userNonce[user.address] }
          )
        );
        userNonce[user.address] = userNonce[user.address] + 1;
      });
  });
  const addEmissionTx = await Promise.all(addEmissionPromises);
  const addEmissionTxPromises = addEmissionTx.map((each) => each.wait());
  await Promise.all(addEmissionTxPromises);
  console.log("Add Emission Done");

  await delay(2000);

  console.log("Add Project To Cart Started");
  let addProjectToCartPromises: any[] = [];
  users.forEach((user, index) => {
    let projectCount = 1;
    Array(1)
      .fill(null)
      .forEach((_i, indexIn) => {
        addProjectToCartPromises.push(
          contract.connect(user).addProjectToCart(
            {
              quantity: 10,
              projectId: projectCount,
            }
            // { nonce: userNonce[user.address] }
          )
        );
        projectCount = projectCount + 1;
        userNonce[user.address] = userNonce[user.address] + 1;
      });
  });
  const addProjectToCartTx = await Promise.all(addProjectToCartPromises);
  const addProjectToCartTxPromises = addProjectToCartTx.map((each) =>
    each.wait()
  );
  await Promise.all(addProjectToCartTxPromises);
  console.log("Add Project To Cart Done");

  await delay(2000);

  console.log("Make Cart Empty Started");
  let makeCartEmptyPromises: any[] = [];
  users.forEach((user, index) => {
    let projectCount = 1;
    Array(1)
      .fill(null)
      .forEach((_i, indexIn) => {
        makeCartEmptyPromises.push(
          contract.connect(user).makeCartEmpty(
            {
              projectId: projectCount,
            }
            // { nonce: userNonce[user.address] }
          )
        );
        userNonce[user.address] = userNonce[user.address] + 1;
        projectCount = projectCount + 1;
      });
  });
  const makeCartEmptyTx = await Promise.all(makeCartEmptyPromises);
  const makeCartEmptyTxPromises = makeCartEmptyTx.map((each) => each.wait());
  await Promise.all(makeCartEmptyTxPromises);
  console.log("Make Cart Empty Done");

  await delay(2000);

  console.log("Add Project to cart again Started");
  let addProjectToCartPromisesAgain: any[] = [];
  users.forEach((user, index) => {
    let projectCount = 1;
    Array(1)
      .fill(null)
      .forEach((_i, indexIn) => {
        addProjectToCartPromisesAgain.push(
          contract.connect(user).addProjectToCart(
            {
              quantity: 10,
              projectId: projectCount,
            }
            // { nonce: userNonce[user.address] }
          )
        );
        userNonce[user.address] = userNonce[user.address] + 1;
        projectCount = projectCount + 1;
      });
  });
  const addProjectToCartAgainTx = await Promise.all(
    addProjectToCartPromisesAgain
  );
  const addProjectToCartAgainTxPromises = addProjectToCartAgainTx.map((each) =>
    each.wait()
  );
  await Promise.all(addProjectToCartAgainTxPromises);
  console.log("Add Project to cart again Done");

  await delay(2000);

  console.log("Buy credits Started");
  const buyCreditsFromCartPromises = users.map((user, _index) =>
    contract.connect(user).buyCreditsFromCart({
      value: 10,
    //   nonce: userNonce[user.address],
    })
  );
  const buyCreditsTx = await Promise.all(buyCreditsFromCartPromises);
  const buyCreditsTxPromises = buyCreditsTx.map((each) => each.wait());
  await Promise.all(buyCreditsTxPromises);
  console.log("Buy credits Done");

  await delay(2000);

  printBalance(users.map((each) => each.address));

  await delay(2000);

  printBalance(orgUser.map((each) => each.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
