const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MockUSDC
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.deployed();
  console.log("MockUSDC deployed to:", mockUSDC.address);

  // Deploy RealEstateToken
  const RealEstateToken = await hre.ethers.getContractFactory(
    "RealEstateToken"
  );
  const realEstateToken = await RealEstateToken.deploy("https://ipfs.io/ipfs/");
  await realEstateToken.deployed();
  console.log("RealEstateToken deployed to:", realEstateToken.address);

  // Deploy OracleConsumer
  const OracleConsumer = await hre.ethers.getContractFactory("OracleConsumer");
  const oracleConsumer = await OracleConsumer.deploy(
    "0x694AA1769357215DE4FAC081bf1f309aDC325306"
  );
  await oracleConsumer.deployed();
  console.log("OracleConsumer deployed to:", oracleConsumer.address);

  // Deploy PropertyManager
  const PropertyManager = await hre.ethers.getContractFactory(
    "PropertyManager"
  );
  const propertyManager = await PropertyManager.deploy(
    "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
    "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000"
  );
  await propertyManager.deployed();
  await propertyManager.setRealEstateToken(realEstateToken.address);
  await propertyManager.setOracleConsumer(oracleConsumer.address);
  console.log("PropertyManager deployed to:", propertyManager.address);

  // Deploy PoRVerifier
  const PoRVerifier = await hre.ethers.getContractFactory("PoRVerifier");
  const poRVerifier = await PoRVerifier.deploy();
  await poRVerifier.deployed();
  console.log("PoRVerifier deployed to:", poRVerifier.address);

  // Deploy LendingPool
  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(
    mockUSDC.address,
    realEstateToken.address,
    oracleConsumer.address
  );
  await lendingPool.deployed();
  console.log("LendingPool deployed to:", lendingPool.address);

  // Deploy RentDistributionVault
  const RentDistributionVault = await hre.ethers.getContractFactory(
    "RentDistributionVault"
  );
  const rentDistributionVault = await RentDistributionVault.deploy(
    mockUSDC.address,
    realEstateToken.address
  );
  await rentDistributionVault.deployed();
  console.log(
    "RentDistributionVault deployed to:",
    rentDistributionVault.address
  );

  // Deploy CCIPBridge
  const CCIPBridge = await hre.ethers.getContractFactory("CCIPBridge");
  const ccipBridge = await CCIPBridge.deploy(
    "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    realEstateToken.address
  );
  await ccipBridge.deployed();
  console.log("CCIPBridge deployed to:", ccipBridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
