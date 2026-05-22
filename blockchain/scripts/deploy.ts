import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PediVault contracts...");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");

  // Deploy PediVaultVaccine
  const Vaccine = await ethers.getContractFactory("PediVaultVaccine");
  const vaccine = await Vaccine.deploy({ gasLimit: 2000000 });
  await vaccine.waitForDeployment();
  console.log("PediVaultVaccine deployed to:", await vaccine.getAddress());

  // Deploy PediVaultAudit
  const Audit = await ethers.getContractFactory("PediVaultAudit");
  const audit = await Audit.deploy({ gasLimit: 2000000 });
  await audit.waitForDeployment();
  console.log("PediVaultAudit deployed to:", await audit.getAddress());

  // Deploy PediVaultAccess
  const Access = await ethers.getContractFactory("PediVaultAccess");
  const access = await Access.deploy({ gasLimit: 2000000 });
  await access.waitForDeployment();
  console.log("PediVaultAccess deployed to:", await access.getAddress());

  console.log("\n✅ All contracts deployed!");
  console.log("RECORDS_CONTRACT=0xfE9FB08bB9f0591cB2D5646FB8f464E9AA81F92C");
  console.log("VACCINE_CONTRACT=" + await vaccine.getAddress());
  console.log("AUDIT_CONTRACT="   + await audit.getAddress());
  console.log("ACCESS_CONTRACT="  + await access.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
