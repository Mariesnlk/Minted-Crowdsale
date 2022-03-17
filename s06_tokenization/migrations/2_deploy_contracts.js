var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KYCContract = artifacts.require("./KYCContract.sol");

require('dotenv').config({ path: '../.env' });

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken);
  await deployer.deploy(KYCContract);
  await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address, KYCContract.address);
};