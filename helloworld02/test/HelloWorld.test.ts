import { assert, expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();


describe("Hello World", function () {

  let helloWorld: any;

  before(async () => {
    helloWorld = await ethers.deployContract("HelloWorld");

  });

  it("Should be Hello EVM", async function () {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const result = await helloWorld.message();

    expect(result).to.equal("Hello EVM");
  });

  it("Should update message", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    await helloWorld.connect(otherAccount).update("new message");

    const message = await helloWorld.message();

    expect(message).to.equal("new message");
  });

  it("Should not Finalize, Not the Owner", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(helloWorld.connect(otherAccount).finalize()).to.be.revertedWith("Not owner");
   
  });

  it("Should not Finalize, Wrong Message", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(helloWorld.connect(owner).finalize()).to.be.revertedWith("Message must be 'finalize'");
   
  });

  it("Should Finalize", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    await helloWorld.connect(otherAccount).update("finalize");

    await helloWorld.connect(owner).finalize();

    expect(await helloWorld.owner()).to.equal("0x0000000000000000000000000000000000000000");
   
  });

  it("Should NOT update message, contract finalized", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    await expect(helloWorld.connect(otherAccount).update("new message")).to.be.revertedWith("Owner is 0, the contract is already finalized.");
    
  });
  
});