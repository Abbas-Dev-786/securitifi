// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for OracleConsumer to be used by other contracts
interface IOracleConsumer {
    function getLatestPrice() external view returns (int);
}

// Contract to fetch real estate index prices from Chainlink Data Feeds
contract OracleConsumer is IOracleConsumer, Ownable {
    AggregatorV3Interface public priceFeed; // Chainlink price feed for real estate index

    // Event for price feed updates
    event PriceFeedUpdated(address indexed newFeed);

    // Constructor sets the Chainlink price feed address
    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Update the price feed address (only owner)
    function setPriceFeed(address _newFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_newFeed);
        emit PriceFeedUpdated(_newFeed);
    }

    // Fetch the latest real estate index price
    function getLatestPrice() external view override returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price from feed");
        return price;
    }
}
