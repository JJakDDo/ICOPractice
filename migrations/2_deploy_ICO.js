const YangTiToken = artifacts.require("YangTiToken");

module.exports = function (deployer) {
  const name = "YangTi Token";
  const symbol = "YTT";
  deployer.deploy(YangTiToken, name, symbol);
};
