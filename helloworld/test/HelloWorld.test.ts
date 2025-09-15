import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Hello World", function () {
  it("Should be hello world", async function () {
    const helloWorld = await ethers.deployContract("HelloWorld");

    const result = await helloWorld.helloWorld();

    expect(result === "Hello EVM", "They are not equal");
  });

  
});
