// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IRealEstateToken.sol";

// Contract to distribute rental income to token holders using Chainlink Automation
contract RentDistributionVault is AutomationCompatibleInterface, Ownable {
    IERC20 public stablecoin; // Stablecoin for rent payments (e.g., USDC)
    IRealEstateToken public realEstateToken; // ERC-1155 token contract

    // Mapping to store accumulated rent for each property
    mapping(uint256 => uint256) public rentPool;
    // Mapping to track last distribution timestamp for each property
    mapping(uint256 => uint256) public lastDistribution;

    // Event for rent deposit
    event RentDeposited(uint256 indexed propertyId, uint256 amount);
    // Event for rent distribution
    event RentDistributed(uint256 indexed propertyId, uint256 totalAmount);

    // Constructor sets stablecoin and token contract addresses
    constructor(
        address _stablecoin,
        address _realEstateToken
    ) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        realEstateToken = IRealEstateToken(_realEstateToken);
    }

    // Deposit rent for a specific property (only owner)
    function depositRent(
        uint256 _propertyId,
        uint256 _amount
    ) external onlyOwner {
        require(_amount > 0, "Amount must be greater than zero");
        stablecoin.transferFrom(msg.sender, address(this), _amount);
        rentPool[_propertyId] += _amount;
        emit RentDeposited(_propertyId, _amount);
    }

    // Check if upkeep is needed for rent distribution (Chainlink Automation)
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        for (uint256 propertyId = 0; propertyId < 100; propertyId++) {
            if (
                rentPool[propertyId] > 0 &&
                block.timestamp >= lastDistribution[propertyId] + 30 days
            ) {
                return (true, abi.encode(propertyId));
            }
        }
        return (false, "");
    }

    // Perform rent distribution (called by Chainlink Automation)
    function performUpkeep(bytes calldata performData) external override {
        uint256 propertyId = abi.decode(performData, (uint256));
        require(rentPool[propertyId] > 0, "No rent to distribute");
        require(
            block.timestamp >= lastDistribution[propertyId] + 30 days,
            "Too early for distribution"
        );

        distributeRent(propertyId);
    }

    // Distribute rent to token holders
    function distributeRent(uint256 _propertyId) internal {
        uint256 totalSupply = realEstateToken.getTotalSupply(_propertyId);
        require(totalSupply > 0, "No tokens for property");

        uint256 totalRent = rentPool[_propertyId];
        uint256 amountPerToken = totalRent / totalSupply;

        // Simplified: Transfer to all token holders (in practice, iterate over holders)
        address[] memory holders = new address[](1); // Placeholder for holder list
        holders[0] = msg.sender; // For demo, assume caller holds all tokens
        for (uint256 i = 0; i < holders.length; i++) {
            uint256 balance = realEstateToken.balanceOf(
                holders[i],
                _propertyId
            );
            if (balance > 0) {
                uint256 payout = balance * amountPerToken;
                stablecoin.transfer(holders[i], payout);
            }
        }

        rentPool[_propertyId] = 0;
        lastDistribution[_propertyId] = block.timestamp;
        emit RentDistributed(_propertyId, totalRent);
    }
}
