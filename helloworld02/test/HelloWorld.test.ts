import { assert, expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();


describe("Hello World", function () {

  let helloWorld: any;

  before(async () => {
    helloWorld = await ethers.deployContract("HelloWorld");

    //console.log("HW address 0:", await helloWorld.getAddress());

  });

  it("Should read the message", async function () {
    
    const [owner, otherAccount] = await ethers.getSigners();

    const result = await helloWorld.message();

    //console.log("Owner 1:", await helloWorld.getAddress());

    expect(result === "Hello EVM", "They are not equal");
  });

  it("Should update message", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

    //console.log("HW address 2:", await helloWorld.getAddress());

    await helloWorld.connect(otherAccount).update("new message");

    const message = await helloWorld.message();

    expect(message).to.equal("new message");
  });

  it("Should not Finalize, Not the Owner", async function () {
 
    const [owner, otherAccount] = await ethers.getSigners();

//    console.log("Add Before 3:", await helloWorld.getAddress());

    //await helloWorld.connect(otherAccount);
/*
    console.log("Add After:", await helloWorld.getAddress());


    const result = await helloWorld.message();

    console.log("Owner 1:", await helloWorld.getAddress());

    expect(result === "Hello EVM", "They are not equal");

    console.log("Owner HW:", await helloWorld.owner());

*/

    await expect(helloWorld.connect(otherAccount).finalize()).to.be.revertedWith("Not owner");

    /*
    try {

      await expect(helloWorld.connect(otherAccount).finalize()).to.be.revertedWith("Not owner");


      // If we got here, the call didn't fail as expected
      // Não pode conter mensagem igual ao do erro
      assert.fail("Expected transaction to be reverted due to HashOutputs Mismatch");
    } catch (err: any) {

      expect(err.message).to.include("Not owner");
    }

    */

    
  });

  


  //TO DO: Testar após a finalização

  
});


/*

describe("Counter", function () {
  it("Should emit the Increment event when calling the inc() function", async function () {
    const counter = await ethers.deployContract("Counter");

    await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
  });

  it("The sum of the Increment events should match the current value", async function () {
    const counter = await ethers.deployContract("Counter");
    const deploymentBlockNumber = await ethers.provider.getBlockNumber();

    // run a series of increments
    for (let i = 1; i <= 10; i++) {
      await counter.incBy(i);
    }

    const events = await counter.queryFilter(
      counter.filters.Increment(),
      deploymentBlockNumber,
      "latest",
    );

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    expect(await counter.x()).to.equal(total);
  });
});
*/