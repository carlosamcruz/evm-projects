import { network } from "hardhat";

const { ethers } = await network.connect();

const initialWei = ethers.parseEther("0.0015"); 
const startValue = 3; // valor inicial do contador

async function main() {

    const implementation = await ethers.deployContract("Counter", [startValue], {
      value: initialWei, // equivalente a msg.value
    });
    //await implementation.waitForDeployment();
    const implementationAddress = await implementation.getAddress();
    console.log(`ImplementationAddress deployed at ${implementationAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});