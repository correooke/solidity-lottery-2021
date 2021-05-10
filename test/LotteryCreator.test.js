const LotteryCreator = artifacts.require("LotteryCreator")


contract("LotteryCreator", accounts => {
    it("should obtain the quantity of created lotteries", async () => {
        // AAA SUT: LotteryCreator
        const creator = await LotteryCreator.deployed()
        
        const quantity = await creator.getLotteriesQuantity();

        assert.equal(0, quantity)
    })

    it("should create a new lottery", async () => {
        const creator = await LotteryCreator.deployed()

        await creator.createLottery("My Lottery", { from: accounts[0] })

        const quantity = await creator.getLotteriesQuantity()

        assert.equal(1, quantity)
    })

    it("should emit a event when create a Lottery", async () => {
        const creator = await LotteryCreator.deployed();
        const tx = await creator.createLottery("SuperSorteo", {from: accounts[0]});

        const { logs } = tx;
        const log = logs[0];
        assert.equal("LotteryCreated", log.event);
    });    
})