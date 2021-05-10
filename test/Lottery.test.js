const LotteryCreator = artifacts.require("LotteryCreator")
const Lottery = artifacts.require("Lottery")

contract("Lottery", accounts => {
    const from = accounts[0];

    it("should create a new contract", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});
        const lotteryData = await creator.getLottery("SuperSorteo", {from});

        assert(lotteryData.timestamp > 0);
    });

    it("should set ticket cost to Lottery with Eth x Ticket", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});
        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);
        await lottery.activate(100, {from});
        const ticketCost = await lottery.getTicketCost({ from });
        assert.equal(100, ticketCost, "the ticket cost is not ok");
    });

    it("should activate Lottery with Eth x Ticket", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});
        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);
        const statusPrev = await lottery.getStatus({from});
        await lottery.activate(100, {from});
        const statusPost = await lottery.getStatus({from});
        assert.equal(statusPrev, 0, "Status Previo");
        assert.equal(statusPost, 1, "Status Post activation");
    });      

    it("should not allow activation Lottery not manager", async () => {
        
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from}); // este es el mananger
        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);
            // const statusPrev = await lottery.getStatus({from});
        try {
            console.log("previo activación");
            await lottery.activate(100, {from: accounts[1]});
            console.log("posterior activación");
            // const statusPost = await lottery.getStatus({from});
            // assert.equal(statusPrev, 0, "Status Previo");
            // assert.equal(statusPost, 1, "Status Post activation");

            assert.equal(true, false, "Invalid Access Allowed");            

        } catch (error) {
            console.log("SALTO CON ERROR! FUE EXITOSO");
            assert.equal(true, true, "Valido");            
        };
    });  

    it("should add Player and obtain my info", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});

        await lottery.buyTicket("Emiliano", {from, value: 100});

        const info = await lottery.getMyInfo();

        assert.equal(info[0], "Emiliano", "The player is different");
    });  
    
    it("should allow add anonymous Player", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});

        await lottery.sendTransaction({from, value: 100});
        //await lottery.buyTicket("Emiliano", {from, value: 100});

        const info = await lottery.getMyInfo({from});

        assert.equal(info[0], "anonymous", "The player is different");
    });  
    
    it("should Not add the same player two times", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});
        
        await lottery.buyTicket("Emiliano", {from, value: 100});
        await lottery.buyTicket("Otro", { from: accounts[1], value: 100});
        try {            
            await lottery.buyTicket("Oke", {from, value: 100}); // same player, other nickname
    
            assert(true, false, "Wrong: Two tickets accepted");
        } catch (error) {
            assert(true, true, "Ok");
            console.log("OK!");
        }
    });
    
    it("should emit a event when buy a Lottery", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});
        
        const tx = await lottery.buyTicket("Emiliano", {from, value: 100});

        const { logs } = tx;
        const log = logs[0];
        assert.equal(log.event, "TicketBought");
    });  
    
    it("should know players quantity", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});
        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);
        
        await lottery.activate(100, {from});
        let i = 0;
        await lottery.buyTicket("Player1", {from: accounts[i++], value: 100});
        await lottery.buyTicket("Player2", {from: accounts[i++], value: 100});
        await lottery.buyTicket("Player3", {from: accounts[i++], value: 100});
        await lottery.buyTicket("Player4", {from: accounts[i++], value: 100});
        await lottery.buyTicket("Player5", {from: accounts[i++], value: 100});

        const qtyPlayers = await lottery.getPlayersQuantity();
        assert.equal(5, qtyPlayers, "Players quantity");
        
    }); 
    
    it("should know player info", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});

        await lottery.buyTicket("Otro", {from, value: 100});

        const info = await lottery.getPlayerInfo(from, {from: accounts[1]});

        assert.equal("Otro", info[0], "The player is different");
    });
 
    it("should not found Player", async () => {
        const creator = await LotteryCreator.deployed();
        await creator.createLottery("SuperSorteo", {from});

        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);

        await lottery.activate(100, {from});

        await lottery.buyTicket("Otro", {from, value: 100});

        const info = await lottery.getPlayerInfo(accounts[3], {from: accounts[1]});

        assert.equal("", info[0], "The player is different");
        assert.equal(0, info[1], "Not Address");
    });   
    
    it.only("should pick a winner", async () => {
        const base_balance_wei = await web3.eth.getBalance(accounts[1]);
        const base_balance = await web3.utils.fromWei(base_balance_wei, "ether");

        const creator = await LotteryCreator.deployed();

        await creator.createLottery("SuperSorteo", {from});
        
        const lotteryData = await creator.getLottery("SuperSorteo", {from});
        const lottery = await Lottery.at(lotteryData.lottery);


        const costTicket = await web3.utils.toWei("50", "ether"); // 30*(10^19);
        await lottery.activate(costTicket, {from});

        // participan todos menos el primero
        for (let index = 1; index < accounts.length; index++) {
            await lottery.buyTicket(index.toString(), {from: accounts[index], value: costTicket });
        }
        
        await lottery.pickWinner({from});
        const winner = await lottery.winner({from});
        const info = await lottery.getPlayerInfo(winner.account, {from});
        const winner_balance_wei = await web3.eth.getBalance(winner.account);
        const winner_balance = await web3.utils.fromWei(winner_balance_wei, "ether");
        console.log("winner_wallet", winner.account);
        console.log("winner", info[0]);

        console.log("balance (base)", base_balance);
        console.log("balance (winner)", winner_balance);
        console.log("earn", Math.round(winner_balance - base_balance));
        assert.equal(400, Math.round(winner_balance - base_balance));
        // assert.equal(info.wallet, winner.wallet, "Wrong wallet");
    });       
    
})