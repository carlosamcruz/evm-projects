import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Counter", function () {

  let counter: any;
  let owner: any;
  let otherAccount1: any;
  let otherAccount2: any;

  const initialWei = ethers.parseEther("0.0015"); // valor enviado no deploy
  const fee = ethers.parseEther("0.01"); // valor enviado no deploy

  before(async () => {
    [owner, otherAccount1, otherAccount2] = await ethers.getSigners();

    // define valores
    const startValue = 3; // valor inicial do contador

    // deploy com argumentos do constructor + valor em wei
    counter = await ethers.deployContract("Counter", [startValue], {
      value: initialWei, // equivalente a msg.value
    });

    //await counter.waitForDeployment();
  });

  it("deve iniciar com o valor definido e saldo enviado", async () => {
    expect(await counter.count()).to.equal(3);
    expect(await counter.owner()).to.equal(owner.address);

    const balance = await ethers.provider.getBalance(await counter.getAddress());
    expect(balance).to.equal(ethers.parseEther("0.0015"));
  });

 

  it("finalize falha por saldo insuficiente", async () => {
    // contador está em 2; finalize deve falhar se exigir count == 0
    await expect(counter.connect(owner).finalize()).to.be.revertedWith("Insufficient balance");
  });
  
  
  it("incremento: deve incrementar o contador em 1", async () => {
    await counter.connect(otherAccount1).increment({
      value: fee, // equivalente a msg.value
    });
    expect(await counter.connect(otherAccount1).count()).to.equal(4);
  });

  it("decremento: deve decrementar o contador em 1", async () => {
   
    await counter.connect(otherAccount1).decrement({
      value: fee, // equivalente a msg.value
    });
    expect(await counter.connect(otherAccount1).count()).to.equal(3);
  });


  it("finalize falha por não ser o owner", async () => {
    // contador está em 2; finalize deve falhar se exigir count == 0
    await expect(counter.connect(otherAccount1).finalize()).to.be.revertedWith("Not owner");
  });

  it("finalize falha por contador >= 3", async () => {
    await counter.connect(otherAccount1).decrement({
      value: fee, // equivalente a msg.value
    });
    expect(await counter.connect(otherAccount1).count()).to.equal(2);
    // contador está em 2; finalize deve falhar se exigir count == 0
    await expect(counter.connect(owner).finalize()).to.be.revertedWith("Count not high enough");
  });

  it("finalize contrato", async () => {
    // outra conta interage e incrementa (adicionando valor)
    await counter.connect(otherAccount1).increment({
      value: fee, // equivalente a msg.value
    });
  
    const counterAddr = await counter.getAddress();
    const ownerAddr = await counter.owner();
  
    // saldo antes
    const contractBalanceBefore = await ethers.provider.getBalance(counterAddr);
    const ownerBalanceBefore = await ethers.provider.getBalance(ownerAddr);
  
    console.log("Saldo do contrato ANTES:", ethers.formatEther(contractBalanceBefore), "ETH");
    console.log("Saldo do owner ANTES:", ethers.formatEther(ownerBalanceBefore), "ETH");
  
    // finalize pelo owner
    await counter.connect(owner).finalize();
  
    // saldo depois
    const contractBalanceAfter = await ethers.provider.getBalance(counterAddr);
    const ownerBalanceAfter = await ethers.provider.getBalance(ownerAddr);
  
    console.log("Saldo do contrato DEPOIS:", ethers.formatEther(contractBalanceAfter), "ETH");
    console.log("Saldo do owner DEPOIS:", ethers.formatEther(ownerBalanceAfter), "ETH");
  
    // owner deve ser resetado para address(0)
    expect(await counter.owner()).to.equal("0x0000000000000000000000000000000000000000");
  
    // contrato deve ter zerado o saldo
    expect(contractBalanceAfter).to.equal(0n);
  
    // owner deve ter recebido o valor que estava no contrato (considerando taxas de gas)
    expect(ownerBalanceAfter).to.be.greaterThan(ownerBalanceBefore);

    await expect(counter.connect(otherAccount1).increment({
      value: fee, // equivalente a msg.value
    })).to.be.revertedWith("Already finalized");

  });

});