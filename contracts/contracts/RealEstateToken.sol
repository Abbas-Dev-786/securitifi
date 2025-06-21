// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC-1155 token contract for fractional ownership of real estate properties
contract RealEstateToken is ERC1155, Ownable {
    // Mapping to track total supply of each token ID (property)
    mapping(uint256 => uint256) public totalSupply;

    // Event for token minting
    event TokensMinted(
        address indexed to,
        uint256 indexed propertyId,
        uint256 amount
    );
    // Event for token burning
    event TokensBurned(
        address indexed from,
        uint256 indexed propertyId,
        uint256 amount
    );

    // Constructor sets the base URI for token metadata
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {}

    // Mint new tokens for a specific property (only owner)
    function mint(
        address _to,
        uint256 _propertyId,
        uint256 _amount
    ) external onlyOwner {
        _mint(_to, _propertyId, _amount, "");
        totalSupply[_propertyId] += _amount;
        emit TokensMinted(_to, _propertyId, _amount);
    }

    // Burn tokens for a specific property (only owner)
    function burn(
        address _from,
        uint256 _propertyId,
        uint256 _amount
    ) external onlyOwner {
        _burn(_from, _propertyId, _amount);
        totalSupply[_propertyId] -= _amount;
        emit TokensBurned(_from, _propertyId, _amount);
    }

    // Set a new base URI for token metadata (only owner)
    function setBaseURI(string memory _newURI) external onlyOwner {
        _setURI(_newURI);
    }

    // View total supply of a specific property token
    function getTotalSupply(
        uint256 _propertyId
    ) external view returns (uint256) {
        return totalSupply[_propertyId];
    }
}
