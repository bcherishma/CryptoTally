import hre from "hardhat";

/**
 * Main deployment function.
 * This function handles the entire deployment process.
 */
async function main() {
  // Get the ContractFactory of your contract.
  // "SmartContract" should be the name of your Solidity contract.
  // The 'ethers' object is now accessed via the 'hre' (Hardhat Runtime Environment).
  const SmartContract = await hre.ethers.getContractFactory("SmartContract");

  // Start the deployment process.
  console.log("Deploying SmartContract...");
  const smartContract = await SmartContract.deploy();

  // Wait for the contract to be deployed.
  await smartContract.deployed();

  // Log the address of the newly deployed contract.
  console.log("SmartContract deployed to:", smartContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
