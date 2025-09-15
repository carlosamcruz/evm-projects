// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract HelloWorld {
  string public message = "Hello EVM";

  function helloWorld() public view returns (string memory){
    return message;
  }


}
