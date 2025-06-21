// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IOracleConsumer.sol";
import "./IRealEstateToken.sol";

// Lending pool for borrowing stablecoins against ERC-1155 property tokens
contract LendingPool is Ownable {
    IERC20 public stablecoin; // Stablecoin (e.g., USDC)
    IRealEstateToken public realEstateToken; // ERC-1155 token contract
    IOracleConsumer public oracleConsumer; // Oracle for real estate index prices

    // Struct to store user loan details
    struct Loan {
        uint256 propertyId; // Property ID used as collateral
        uint256 collateralAmount; // Amount of ERC-1155 tokens
        uint256 borrowedAmount; // Amount of stablecoin borrowed
    }

    // Mapping of user address to their loan
    mapping(address => Loan) public loans;
    // Mapping of property ID to its LTV ratio (in percentage, e.g., 70 for 70%)
    mapping(uint256 => uint256) public ltvRatios;

    // Events for tracking lending activities
    event CollateralDeposited(
        address indexed user,
        uint256 indexed propertyId,
        uint256 amount
    );
    event StablecoinBorrowed(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);
    event LTVAdjusted(uint256 indexed propertyId, uint256 newLTV);

    // Constructor sets initial contract addresses
    constructor(
        address _stablecoin,
        address _realEstateToken,
        address _oracleConsumer
    ) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        realEstateToken = IRealEstateToken(_realEstateToken);
        oracleConsumer = IOracleConsumer(_oracleConsumer);
    }

    // Deposit ERC-1155 tokens as collateral
    function depositCollateral(uint256 _propertyId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            loans[msg.sender].borrowedAmount == 0,
            "Repay existing loan first"
        );

        realEstateToken.safeTransferFrom(
            msg.sender,
            address(this),
            _propertyId,
            _amount,
            ""
        );
        loans[msg.sender] = Loan(_propertyId, _amount, 0);
        emit CollateralDeposited(msg.sender, _propertyId, _amount);
    }

    // Borrow stablecoins against deposited collateral
    function borrowStablecoin(uint256 _amount) external {
        Loan storage loan = loans[msg.sender];
        require(loan.collateralAmount > 0, "No collateral deposited");
        require(_amount > 0, "Amount must be greater than zero");
        require(loan.borrowedAmount == 0, "Existing loan active");

        uint256 maxBorrow = calculateMaxBorrow(
            loan.propertyId,
            loan.collateralAmount
        );
        require(_amount <= maxBorrow, "Borrow amount exceeds LTV limit");

        loan.borrowedAmount = _amount;
        stablecoin.transfer(msg.sender, _amount);
        emit StablecoinBorrowed(msg.sender, _amount);
    }

    // Repay stablecoin loan
    function repayLoan(uint256 _amount) external {
        Loan storage loan = loans[msg.sender];
        require(loan.borrowedAmount >= _amount, "Invalid repayment amount");

        stablecoin.transferFrom(msg.sender, address(this), _amount);
        loan.borrowedAmount -= _amount;

        if (loan.borrowedAmount == 0) {
            realEstateToken.safeTransferFrom(
                address(this),
                msg.sender,
                loan.propertyId,
                loan.collateralAmount,
                ""
            );
            delete loans[msg.sender];
        }
        emit LoanRepaid(msg.sender, _amount);
    }

    // Adjust LTV ratio for a property based on oracle data (only owner)
    function adjustLTV(uint256 _propertyId) external onlyOwner {
        int256 latestPrice = oracleConsumer.getLatestPrice();
        require(latestPrice > 0, "Invalid price from oracle");

        // Example: Adjust LTV based on price movement (simplified logic)
        uint256 newLTV = uint256(latestPrice) > 1000 ? 70 : 50; // 70% or 50% LTV
        ltvRatios[_propertyId] = newLTV;
        emit LTVAdjusted(_propertyId, newLTV);
    }

    // Calculate maximum borrowable amount based on collateral and LTV
    function calculateMaxBorrow(
        uint256 _propertyId,
        uint256 _collateralAmount
    ) public view returns (uint256) {
        uint256 ltv = ltvRatios[_propertyId] == 0 ? 50 : ltvRatios[_propertyId]; // Default LTV 50%
        // Simplified: Assume collateral value is proportional to amount
        return (_collateralAmount * ltv) / 100;
    }

    // Function to handle ERC-1155 token receipt
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }
}
