// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IRealEstateToken.sol";
import "./IOracleConsumer.sol";

contract PropertyManager is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    struct Property {
        string metadataURI;
        bool verified;
        uint256 initialValue;
        uint256 initialIndex;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;
    mapping(bytes32 => uint256) public requestToProperty;

    IRealEstateToken public realEstateToken;
    IOracleConsumer public oracleConsumer;

    bytes32 public donId; // Changed from string to bytes32

    event PropertySubmitted(
        uint256 indexed propertyId,
        string metadataURI,
        uint256 initialValue
    );
    event VerificationRequested(uint256 indexed propertyId, bytes32 requestId);
    event PropertyVerified(uint256 indexed propertyId);
    event MetadataUpdated(uint256 indexed propertyId, string metadataURI);

    constructor(
        address functionsRouter,
        bytes32 _donId
    ) FunctionsClient(functionsRouter) Ownable(msg.sender) {
        donId = _donId;
    }

    function setRealEstateToken(address _realEstateToken) external onlyOwner {
        realEstateToken = IRealEstateToken(_realEstateToken);
    }

    function setOracleConsumer(address _oracleConsumer) external onlyOwner {
        oracleConsumer = IOracleConsumer(_oracleConsumer);
    }

    function submitProperty(
        string memory _metadataURI,
        uint256 _initialValue
    ) external onlyOwner {
        properties[propertyCount] = Property(
            _metadataURI,
            false,
            _initialValue,
            0
        );
        emit PropertySubmitted(propertyCount, _metadataURI, _initialValue);
        propertyCount++;
    }

    function verifyProperty(
        uint256 _propertyId,
        uint64 _subscriptionId
    ) external onlyOwner {
        require(_propertyId < propertyCount, "Invalid property ID");
        require(!properties[_propertyId].verified, "Already verified");

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(
            "return Functions.encodeBool(true);"
        );
        string[] memory args = new string[](1);
        args[0] = Strings.toString(_propertyId);
        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            _subscriptionId,
            200000,
            donId // Pass donId directly as bytes32
        );

        requestToProperty[requestId] = _propertyId;
        emit VerificationRequested(_propertyId, requestId);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory /* err */
    ) internal override {
        uint256 propertyId = requestToProperty[requestId];
        if (response.length > 0) {
            bool isVerified = abi.decode(response, (bool));
            if (isVerified) {
                properties[propertyId].verified = true;
                emit PropertyVerified(propertyId);
            }
        }
    }

    function setInitialIndex(uint256 _propertyId) external onlyOwner {
        require(properties[_propertyId].verified, "Property not verified");
        int256 latestPrice = oracleConsumer.getLatestPrice();
        require(latestPrice > 0, "Invalid price from oracle");
        properties[_propertyId].initialIndex = uint256(latestPrice);
    }

    function storeMetadata(
        uint256 _propertyId,
        string memory _metadataURI
    ) external onlyOwner {
        require(properties[_propertyId].verified, "Property not verified");
        properties[_propertyId].metadataURI = _metadataURI;
        emit MetadataUpdated(_propertyId, _metadataURI);
    }

    function getPropertyDetails(
        uint256 _propertyId
    ) external view returns (string memory, bool, uint256, uint256) {
        require(_propertyId < propertyCount, "Invalid property ID");
        Property memory prop = properties[_propertyId];
        return (
            prop.metadataURI,
            prop.verified,
            prop.initialValue,
            prop.initialIndex
        );
    }

    function mintTokens(
        uint256 _propertyId,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        require(properties[_propertyId].verified, "Property not verified");
        realEstateToken.mint(_to, _propertyId, _amount);
    }

    function setDonId(bytes32 _donId) external onlyOwner {
        donId = _donId;
    }
}
