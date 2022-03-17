const Token = artifacts.require("MyToken");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Test MyToken - MSNLK ", async (accounts) => {

  const [initialHolder, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myToken = await Token.new({ from: accounts[0] });
  })

  it("After deploying MyToken contract MSNLK should be 0 ", async () => {
    let contract = this.myToken;
    let totalSupply = await contract.totalSupply();

    await expect(contract.totalSupply()).to.eventually.be.a.bignumber.equal(new BN(0));
    return await expect(contract.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("Minter can be only initialHolder", async () => {
    let contract = this.myToken;

    await expect(contract.isMinter(initialHolder)).to.eventually.equal(true);
    await expect(contract.isMinter(recipient)).to.eventually.equal(false);
    return await expect(contract.isMinter(anotherAccount)).to.eventually.equal(false);
  });

  it("Mint some tokens and transfer to initialHolder account", async () => {
    let contract = this.myToken;
    // await expect(contract.mint(initialHolder, new BN(2))).to.eventually.be.equal(true);
    await contract.mint(initialHolder, new BN(2));
    await expect(contract.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(2));
    return await expect(contract.totalSupply()).to.eventually.be.a.bignumber.equal(new BN(2));
  });

  it("Only minter can mint tokens", async () => {
    let contract = this.myToken;

    contract.mint(anotherAccount, new BN(2), { from: anotherAccount });
    await expect(contract.balanceOf(anotherAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    return await expect(contract.totalSupply()).to.eventually.be.a.bignumber.equal(new BN(0));
  });

})
