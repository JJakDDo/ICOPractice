const { assert } = require("chai");
const EVMRevert = require("./helpers/EVMRevert");
const BigNumber = web3.utils.BN;
const { time } = require("@openzeppelin/test-helpers");

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bn")(BigNumber))
  .should();

const YangTiToken = artifacts.require("YangTiToken");
const YTTCrowdSale = artifacts.require("YTTCrowdSale");
contract("YTTCrowdSale", async (accounts) => {
  let yangTiToken;
  let yttCrowdSale;
  const name = "YangTi Token";
  const symbol = "YTT";
  const deployer = accounts[0];
  const rate = 500;
  const wallet = accounts[9];
  const hardCap = web3.utils.toWei("2", "ether");
  const goal = web3.utils.toWei("1", "ether");
  let openingTime;
  let closingTime;

  beforeEach(async () => {
    openingTime = await time.latest();
    closingTime = await time.duration.weeks(1);
    yangTiToken = await YangTiToken.new(name, symbol);
    yttCrowdSale = await YTTCrowdSale.new(
      wallet,
      rate,
      yangTiToken.address,
      hardCap,
      new BigNumber(openingTime).add(new BigNumber("100")).toString(),
      new BigNumber(openingTime).add(new BigNumber(closingTime)).toString(),
      goal
    );

    await yangTiToken.transferOwnership(yttCrowdSale.address);
    await time.increase(100);
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
    it("has correct cap value", async () => {
      const cap = await yttCrowdSale.hardCap();
      cap.should.be.bignumber.equal(hardCap);
    });
    it("has correct goal value", async () => {
      const _goal = await yttCrowdSale.goal();
      _goal.should.be.bignumber.equal(goal);
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
    /*
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
    */
  });

  describe("cap", () => {
    it("should not be purchased when sending less than minimum cap value", async () => {
      const value = web3.utils.toWei("0.000001", "ether");
      await yttCrowdSale
        .buyTokens(accounts[1], {
          from: accounts[1],
          value: value,
        })
        .should.be.rejectedWith(EVMRevert);
    });
    it("should not be purchased when sending more than maximum cap value", async () => {
      let value = web3.utils.toWei("0.5", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;

      value = web3.utils.toWei("0.6", "ether");
      await yttCrowdSale
        .buyTokens(accounts[1], {
          from: accounts[1],
          value: value,
        })
        .should.be.rejectedWith(EVMRevert);
    });
    it("should be purchased when sending correct amount of ether", async () => {
      const value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
    });
    it("total funded ether should not exceed 2 ether", async () => {
      let value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
      value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[2], {
        from: accounts[2],
        value: value,
      }).should.be.fulfilled;
      value = web3.utils.toWei("1", "ether");
      await yttCrowdSale
        .buyTokens(accounts[3], {
          from: accounts[3],
          value: value,
        })
        .should.be.rejectedWith(EVMRevert);
    });
  });

  describe("time limit", () => {
    it("is Opened", async () => {
      const isClosed = await yttCrowdSale.isClosed();
      isClosed.should.be.false;
    });
    it("is Closed", async () => {
      const timeDuration = await time.duration.weeks(2);
      await time.increase(timeDuration);
      const isClosed = await yttCrowdSale.isClosed();
      isClosed.should.be.true;
    });
    it("not able to buy when Crowdsale closed", async () => {
      const timeDuration = await time.duration.weeks(2);
      await time.increase(timeDuration);
      let value = web3.utils.toWei("1", "ether");
      await yttCrowdSale
        .buyTokens(accounts[1], {
          from: accounts[1],
          value: value,
        })
        .should.be.rejectedWith(EVMRevert);
    });
  });

  describe.only("goal", () => {
    it("has reached goal", async () => {
      let value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;
      const hasReachedGoal = await yttCrowdSale.hasReachedGoal();
      hasReachedGoal.should.be.true;
    });
    it("owner claims the funds when goal has been reached and crowdsale finished", async () => {
      let value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;

      value = web3.utils.toWei("1", "ether");
      await yttCrowdSale.buyTokens(accounts[2], {
        from: accounts[2],
        value: value,
      }).should.be.fulfilled;

      const originalBalance = await web3.eth.getBalance(wallet);
      await yttCrowdSale.finishCrowdsale();
      const newBalance = await web3.eth.getBalance(wallet);
      assert.isTrue(newBalance > originalBalance);
    });
    it("buyer claims the refunds when goal has not been reached and crowdsale finished", async () => {
      let value = web3.utils.toWei("0.5", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;

      value = web3.utils.toWei("0.1", "ether");
      await yttCrowdSale.buyTokens(accounts[2], {
        from: accounts[2],
        value: value,
      }).should.be.fulfilled;

      const originalBalance = await web3.eth.getBalance(accounts[1]);
      await yttCrowdSale.finishCrowdsale();
      await yttCrowdSale.claimRefund({ from: accounts[1] });
      const newBalance = await web3.eth.getBalance(accounts[1]);
      assert.isTrue(newBalance > originalBalance);
    });

    it("cannot claim refunds when the owner does not finish crowdsale", async () => {
      let value = web3.utils.toWei("0.5", "ether");
      await yttCrowdSale.buyTokens(accounts[1], {
        from: accounts[1],
        value: value,
      }).should.be.fulfilled;

      value = web3.utils.toWei("0.1", "ether");
      await yttCrowdSale.buyTokens(accounts[2], {
        from: accounts[2],
        value: value,
      }).should.be.fulfilled;

      const originalBalance = await web3.eth.getBalance(accounts[1]);
      await yttCrowdSale.finishCrowdsale();
      await yttCrowdSale.claimRefund({ from: accounts[1] });
      const newBalance = await web3.eth.getBalance(accounts[1]);
      assert.isTrue(newBalance > originalBalance);
    });
  });
});
