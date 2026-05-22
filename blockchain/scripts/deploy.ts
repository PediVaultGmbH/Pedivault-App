import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PediVault contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy PediVaultRecords
  const Records = await ethers.getContractFactory("PediVaultRecords");
  const records = await Records.deploy();
  await records.waitForDeployment();
  console.log("PediVaultRecords deployed to:", await records.getAddress());

  // Deploy PediVaultVaccine
  const Vaccine = await ethers.getContractFactory("PediVaultVaccine");
  const vaccine = await Vaccine.deploy();
  await vaccine.waitForDeployment();
  console.log("PediVaultVaccine deployed to:", await vaccine.getAddress());

  // Deploy PediVaultAudit
  const Audit = await ethers.getContractFactory("PediVaultAudit");
  const audit = await Audit.deploy();
  await audit.waitForDeployment();
  console.log("PediVaultAudit deployed to:", await audit.getAddress());

  // Deploy PediVaultAccess
  const Access = await ethers.getContractFactory("PediVaultAccess");
  const access = await Access.deploy();
  await access.waitForDeployment();
  console.log("PediVaultAccess deployed to:", await access.getAddress());

  console.log("\n✅ All contracts deployed!");
  console.log("RECORDS_CONTRACT=" + await records.getAddress());
  console.log("VACCINE_CONTRACT=" + await vaccine.getAddress());
  console.log("AUDIT_CONTRACT="   + await audit.getAddress());
  console.log("ACCESS_CONTRACT="  + await access.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
