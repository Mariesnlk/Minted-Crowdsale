const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KYCContract = artifacts.require("KYCContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale", async function (accounts) {
    const [initialHolder, recipient] = accounts;

    beforeEach(async () => {
        this.myToken = await Token.new({ from: accounts[0] });
        this.kycContract = await KYCContract.new();

    })

    it("should not be any coins in initialHolder account", async () => {
        let contract = this.myToken;
        return expect(contract.balanceOf.call(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all coins should be in the TokenSale smart contract", async () => {
        let contract = this.myToken;
        let balance = await contract.balanceOf.call(TokenSale.address);
        let totalSupply = await contract.totalSupply.call();
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should possible to return rate, wallet and token from MyTokenSale contract", async () => {
        let tokenContract = this.myToken;
        let kycContract = this.kycContract;

        await kycContract.setKYCCompleted(recipient);

        let tokenSaleContract = await TokenSale.new(1, initialHolder, tokenContract.address, kycContract.address);

        await expect(tokenSaleContract.rate()).to.eventually.be.a.bignumber.equal(new BN(1));
        await expect(tokenSaleContract.token()).to.eventually.equal(tokenContract.address);
        return await expect(tokenSaleContract.wallet()).to.eventually.equal(initialHolder);
    });

    it("should possible to buy one token", async () => {
        let tokenContract = this.myToken;
        let kycContract = this.kycContract;

        await kycContract.setKYCCompleted(recipient);

        let tokenSaleContract = await TokenSale.new(1, initialHolder, tokenContract.address, kycContract.address);
        
        await tokenContract.addMinter(tokenSaleContract.address);
        await expect(tokenContract.isMinter(tokenSaleContract.address)).to.eventually.equal(true);
        await expect(tokenContract.balanceOf.call(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await expect(tokenSaleContract.buyTokens(recipient, {value: web3.utils.toWei("1", "wei") })).to.eventually.be.fulfilled;
        return await expect(tokenContract.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1));
    });

    it("weiAmount cannot be 0", async () => {
        let tokenContract = this.myToken;
        let kycContract = this.kycContract;

        await kycContract.setKYCCompleted(recipient);

        let tokenSaleContract = await TokenSale.new(1, initialHolder, tokenContract.address, kycContract.address);
        
        await tokenContract.addMinter(tokenSaleContract.address);
        await expect(tokenContract.isMinter(tokenSaleContract.address)).to.eventually.equal(true);
        await expect(tokenContract.balanceOf.call(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await expect(tokenSaleContract.buyTokens(recipient, {value: web3.utils.toWei("0", "wei") })).to.eventually.be.rejected;
        return await expect(tokenContract.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("beneficiary cannot be zero acount", async () => {
        let tokenContract = this.myToken;
        let kycContract = this.kycContract;

        let zeroAddress = '0x0000000000000000000000000000000000000000';
        
        await kycContract.setKYCCompleted(zeroAddress);

        let tokenSaleContract = await TokenSale.new(1, initialHolder, tokenContract.address, kycContract.address);
        
        await tokenContract.addMinter(tokenSaleContract.address);
        await expect(tokenContract.isMinter(tokenSaleContract.address)).to.eventually.equal(true);
        await expect(tokenContract.addMinter(zeroAddress)).to.eventually.be.rejected;
        return await expect(tokenSaleContract.buyTokens(zeroAddress, {value: web3.utils.toWei("0", "wei") })).to.eventually.be.rejected;
    });

});