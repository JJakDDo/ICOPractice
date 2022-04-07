const YangTiToken = artifacts.require("YangTiToken");
const YTTCrowdSale = artifacts.require("YTTCrowdSale");

const duration = {
  seconds: function (val) {
    return val;
  },
  minutes: function (val) {
    return val * this.seconds(60);
  },
  hours: function (val) {
    return val * this.minutes(60);
  },
  days: function (val) {
    return val * this.hours(24);
  },
  weeks: function (val) {
    return val * this.days(7);
  },
  years: function (val) {
    return val * this.days(365);
  },
};

module.exports = async function (deployer, network, accounts) {
  const name = "YangTi Token";
  const symbol = "YTT";
  await deployer.deploy(YangTiToken, name, symbol);
  const deployedToken = await YangTiToken.deployed();

  const latestTime = new Date().getTime();
  const rate = 500;
  const token = deployedToken.address;
  const wallet = accounts[9];
  const hardCap = web3.utils.toWei("5", "ether");
  const goal = web3.utils.toWei("3", "ether");
  const openingTime = latestTime + duration.minutes(1);
  const closingTime = openingTime + duration.minutes(5);

  await deployer.deploy(
    YTTCrowdSale,
    wallet,
    rate,
    token,
    hardCap,
    openingTime,
    closingTime,
    goal
  );
};
