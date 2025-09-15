// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {HelloWorld} from "./HelloWorld.sol";
//import {Test} from "forge-std/Test.sol";

import {Test} from "forge-std/Test.sol";

// Solidity tests are compatible with foundry, so they
// use the same syntax and offer the same functionality.

contract HelloWorldTest is Test {
  HelloWorld helloWorld;

  function setUp() public {
    helloWorld = new HelloWorld();
  }

  function test_helloWorld() public view {
    bytes32 expected = keccak256(bytes("Hello EVM"));
    string memory result = helloWorld.helloWorld();
    require(expected == keccak256(bytes(result)), "Should be Hello EVM");
  }
}
