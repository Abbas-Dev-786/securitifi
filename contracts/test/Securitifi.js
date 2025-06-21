const { expect } = require("chai");

describe("SecuritiFi", function () {
  let realEstateToken, propertyManager, owner;

  beforeEach(async function () {
    const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
    const PropertyManager = await ethers.getContractFactory("PropertyManager");
    [owner] = await ethers.getSigners();

    realEstateToken = await RealEstateToken.deploy("https://ipfs.io/ipfs/");
    await realEstateToken.deployed();

    propertyManager = await PropertyManager.deploy(
      "YOUR_FUNCTIONS_ROUTER_ADDRESS"
    );
    await propertyManager.deployed();
    await propertyManager.setRealEstateToken(realEstateToken.address);
  });

  it("Should submit and verify a property", async function () {
    await propertyManager.submitProperty("ipfs://example", 1000000);
    const [metadataURI, verified] = await propertyManager.getPropertyDetails(0);
    expect(metadataURI).to.equal("ipfs://example");
    expect(verified).to.equal(false);
  });
});
