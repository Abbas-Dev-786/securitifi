// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOracleConsumer {
    function getLatestPrice() external view returns (int);
}
