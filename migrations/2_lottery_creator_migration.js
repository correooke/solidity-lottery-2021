const LotteryCreator = artifacts.require("LotteryCreator")

module.exports = deployer => {
    deployer.deploy(LotteryCreator);
}

