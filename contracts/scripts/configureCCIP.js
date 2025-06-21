const hre = require("hardhat");

async function main() {
  const ccipBridgeAddress = "0x92d791321F06cF646555d5ca622e61043B979eD3";
  const CCIPBridge = await hre.ethers.getContractFactory("CCIPBridge");
  const ccipBridge = await CCIPBridge.attach(ccipBridgeAddress);

  await ccipBridge.setDestinationChain(
    "sepolia",
    "16015286601757825753",
    "0x92d791321F06cF646555d5ca622e61043B979eD3"
  );
  console.log("CCIP configured for Mumbai");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
