// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IRealEstateToken.sol";

// Contract to bridge ERC-1155 tokens across chains using Chainlink CCIP
contract CCIPBridge is Ownable {
    IRouterClient public ccipRouter; // CCIP Router for cross-chain communication
    IRealEstateToken public realEstateToken; // ERC-1155 token contract

    // Mapping to store destination chain selectors
    mapping(string => uint64) public chainSelectors;
    // Mapping to store bridge contract addresses on other chains
    mapping(string => address) public destinationBridges;

    // Events for cross-chain operations
    event TokensLocked(
        address indexed sender,
        uint256 indexed propertyId,
        uint256 amount,
        string destinationChain
    );
    event TokensMinted(
        address indexed receiver,
        uint256 indexed propertyId,
        uint256 amount,
        string sourceChain
    );

    // Constructor sets CCIP Router and RealEstateToken addresses
    constructor(
        address _ccipRouter,
        address _realEstateToken
    ) Ownable(msg.sender) {
        ccipRouter = IRouterClient(_ccipRouter);
        realEstateToken = IRealEstateToken(_realEstateToken);
    }

    // Set destination chain selector and bridge contract address (only owner)
    function setDestinationChain(
        string memory _chainName,
        uint64 _chainSelector,
        address _bridgeAddress
    ) external onlyOwner {
        chainSelectors[_chainName] = _chainSelector;
        destinationBridges[_chainName] = _bridgeAddress;
    }

    // Lock tokens on source chain and send message to mint on destination chain
    function lockAndSend(
        address _to,
        uint256 _propertyId,
        uint256 _amount,
        string memory _destinationChain
    ) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            chainSelectors[_destinationChain] != 0,
            "Invalid destination chain"
        );
        require(
            destinationBridges[_destinationChain] != address(0),
            "Bridge not set"
        );

        // Transfer tokens to this contract for locking
        realEstateToken.safeTransferFrom(
            msg.sender,
            address(this),
            _propertyId,
            _amount,
            ""
        );

        // Prepare CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(destinationBridges[_destinationChain]),
            data: abi.encode(_to, _propertyId, _amount),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200000})
            ),
            feeToken: address(0) // Pay fees in native currency
        });

        // Send CCIP message
        ccipRouter.ccipSend(chainSelectors[_destinationChain], message);
        emit TokensLocked(msg.sender, _propertyId, _amount, _destinationChain);
    }

    // Receive CCIP message and mint tokens on destination chain
    function ccipReceive(Client.Any2EVMMessage memory message) external {
        require(msg.sender == address(ccipRouter), "Only CCIP Router can call");
        (address to, uint256 propertyId, uint256 amount) = abi.decode(
            message.data,
            (address, uint256, uint256)
        );

        // Mint tokens on this chain
        realEstateToken.mint(to, propertyId, amount);
        emit TokensMinted(to, propertyId, amount, "sourceChain"); // Simplified source chain name
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
