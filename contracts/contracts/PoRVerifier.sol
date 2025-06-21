// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Contract to verify Proof of Reserves (PoR) for property deeds using Chainlink
contract PoRVerifier is Ownable {
    // Mapping to store the PoR feed address for each property
    mapping(uint256 => address) public propertyPoRFeed;

    // Event for setting PoR feed for a property
    event PoRFeedSet(uint256 indexed propertyId, address feedAddress);
    // Event for reserve status check
    event ReserveStatusChecked(uint256 indexed propertyId, bool isValid);

    constructor() Ownable(msg.sender) {}

    // Set the PoR feed for a specific property (only owner)
    function setPoRFeed(
        uint256 _propertyId,
        address _feedAddress
    ) external onlyOwner {
        propertyPoRFeed[_propertyId] = _feedAddress;
        emit PoRFeedSet(_propertyId, _feedAddress);
    }

    // Check the reserve status for a property
    function checkReserveStatus(uint256 _propertyId) external returns (bool) {
        address feedAddress = propertyPoRFeed[_propertyId];
        require(feedAddress != address(0), "PoR feed not set for property");

        AggregatorV3Interface porFeed = AggregatorV3Interface(feedAddress);
        (, int256 answer, , , ) = porFeed.latestRoundData();
        bool isValid = answer > 0; // Positive value indicates valid reserve
        emit ReserveStatusChecked(_propertyId, isValid);
        return isValid;
    }

    // Pause operations for a property if reserve verification fails (only owner)
    function pauseOperations(uint256 _propertyId) external onlyOwner {
        emit ReserveStatusChecked(_propertyId, false);
    }
}
