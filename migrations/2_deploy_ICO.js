const YangTiToken = artifacts.require("YangTiToken");
const MintToken = artifacts.require("MintToken");

module.exports = function (deployer) {
  const name = "YangTi Token";
  const symbol = "YTT";
  deployer.deploy(YangTiToken, name, symbol);
};
