const { assert } = require("chai");
const EVMRevert = require("./helpers/EVMRevert");
const BigNumber = web3.utils.BN;
require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bn")(BigNumber))
  .should();

const YangTiToken = artifacts.require("YangTiToken");
const YTTCrowdSale = artifacts.require("YTTCrowdSale");

contract("YTTCrowdSale", (accounts) => {
  let yangTiToken;
  let yttCrowdSale;
  const name = "YangTi Token";
  const symbol = "YTT";
  const deployer = accounts[0];
  const rate = 500;
  const wallet = accounts[9];

  beforeEach(async () => {
    yangTiToken = await YangTiToken.new(name, symbol);
    yttCrowdSale = await YTTCrowdSale.new(wallet, rate, yangTiToken.address);

    await yangTiToken.transferOwnership(yttCrowdSale.address);
  });
  describe("crowdsale", () => {
    it("has the correct rate", async () => {
      const _rate = await yttCrowdSale.rate();
      _rate.should.be.bignumber.equal(rate.toString());
    });
    it("has the correct wallet address", async () => {
      const _wallet = await yttCrowdSale.wallet();
      _wallet.should.equal(wallet);
    });
    it("has the correct token address", async () => {
      const _token = await yttCrowdSale.token();
      _token.should.equal(yangTiToken.address);
    });
  });

  describe("accepts payments", () => {
    it("should accept payments", async () => {
      const value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
    });
  });

  describe("mint", () => {
    it("mint new token after successful purchase", async () => {
      const originalTotalSupply = await yangTiToken.totalSupply();
      const value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
      const newTotalSupply = await yangTiToken.totalSupply();
      assert.isTrue(newTotalSupply > originalTotalSupply);
    });
    it("it stores correct total funded ether", async () => {
      const value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
      const totalFundedInWei = await yttCrowdSale.totalFundedInWei();
      web3.utils.fromWei(totalFundedInWei, "ether").should.equal("1");
    });
    it("correct funded ether is transfered to ICO owner's address ", async () => {
      const originalBalance = await web3.eth.getBalance(wallet);
      const value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
      const newBalance = await web3.eth.getBalance(wallet);
      assert.isTrue(newBalance > originalBalance);
    });
  });
});
