const YangTiToken = artifacts.require("YangTiToken");
const EVMRevert = require("./helpers/EVMRevert");
const BigNumber = web3.utils.BN;
require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bn")(BigNumber))
  .should();

contract("YangTiToken", (accounts) => {
  let yangTiToken;
  const name = "YangTi Token";
  const symbol = "YTT";
  const deployer = accounts[0];
  before(async () => {
    yangTiToken = await YangTiToken.new(name, symbol);
  });
  describe("token attributes", () => {
    it("has the correct token name", async () => {
      const _name = await yangTiToken.name();
      _name.should.equal(name);
    });
    it("has the correct token symbol", async () => {
      const _symbol = await yangTiToken.symbol();
      _symbol.should.equal(symbol);
    });
  });

  describe("minting 1 token", () => {
    it("has the correct total supply", async () => {
      await yangTiToken.mint(accounts[1], 1);
      const totalSupply = await yangTiToken.totalSupply();
      totalSupply.should.be.bignumber.equal("1");
    });
    it("token owner has the correct balance", async () => {
      const balance = await yangTiToken.balanceOf(accounts[1]);
      balance.should.be.bignumber.equal("1");
    });
    it("only owner can mint", async () => {
      await yangTiToken
        .mint(accounts[1], 1, { from: accounts[2] })
        .should.be.rejectedWith(EVMRevert);
    });
  });
});
