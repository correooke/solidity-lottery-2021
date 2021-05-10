// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import { Lottery } from './Lottery.sol';
import { ILottery } from './ILottery.sol';

/// @title A creator of lotteries
/// @author Emiliano Oke Ocariz
/// @notice 
/// @dev 
contract LotteryCreator {
    
    struct LotteryData {
        string name; // clave
        uint timestamp;
        address owner;
        ILottery lottery;
    }

    mapping(string => LotteryData) _lotteriesData;

    uint _lotteriesQuantity = 0;

    event LotteryCreated(string name);

    function getLotteriesQuantity() public view returns (uint) {
        return _lotteriesQuantity;
    }

    function createLottery(string memory name) public {
        ILottery lottery = new Lottery(msg.sender);
        LotteryData memory data = LotteryData(name, block.timestamp, msg.sender, lottery);
        _lotteriesData[name] = data;

        _lotteriesQuantity++;

        emit LotteryCreated(name);
    }

    function getLottery(string memory name) public view returns (LotteryData memory) {
        return _lotteriesData[name];
    }

    function addLotteryToList(string memory name, ILottery newLottery) internal {
        LotteryData memory data = LotteryData(name, block.timestamp, msg.sender, newLottery);
        _lotteriesData[name] = data;

        _lotteriesQuantity++;

        emit LotteryCreated(name);
    }      

}