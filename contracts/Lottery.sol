// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import { ILottery } from './ILottery.sol';

contract Lottery is ILottery {

    enum Status {
        inactive, // 0
        active, // 1
        finished // 2
    }

    struct Player {
        string playerName;
        address payable account;
        uint index;
    }

    uint _ticketCost;
    Status private _status;
    address _owner;
    uint _playerIndex;

    mapping( address => Player ) _players;

    address[] _playerByIndex;

    Player public winner;

    event TicketBought();
    event WinnerSelected();

    modifier OnlyOwner() {
        require(msg.sender == _owner, "Only the owner can activate the contract");
        _;
    }

    constructor(address owner) {
        _owner = owner;
        _status = Status.inactive;
    }


    function activate(uint ticketCost) override external OnlyOwner {
        
        _ticketCost = ticketCost;
        _status = Status.active;
    } 

    function getTicketCost() view override external returns(uint) {
        return _ticketCost;
    }

    function getStatus() view external returns(Status){
        return _status;
    }

    function buyTicket(string calldata playerName) override external payable {
        buyTicketInternal(playerName);
    }

    receive() external payable {
        buyTicketInternal("anonymous");
    }  

    function buyTicketInternal(string memory playerName) internal {
        require(_players[msg.sender].account == address(0), "The player is already playing");
        address payable buyer = msg.sender;
        Player memory newPlayer = Player(playerName, buyer, _playerIndex);
        _playerIndex++;
        _players[buyer] = newPlayer;
        _playerByIndex.push(buyer);
        emit TicketBought();
    }  

    function getMyInfo() view external returns (string memory, address, uint) {
        Player storage myInfo = _players[msg.sender];
        return (myInfo.playerName, myInfo.account, myInfo.index);
    }

    function getPlayerInfo(address playerAddress) view external returns (string memory, address, uint) {
        Player storage myInfo = _players[playerAddress];
        return (myInfo.playerName, myInfo.account, myInfo.index);
    }

    function getPlayersQuantity() view external returns (uint) {
        return _playerIndex;
    }

    function pickWinner() override external OnlyOwner {
        uint rndNumber = rnd();
        address playerAddress = _playerByIndex[rndNumber % _playerByIndex.length];
        winner = _players[playerAddress];

        winner.account.transfer(address(this).balance);

        _status = Status.finished;
        emit WinnerSelected();
    }

    function rnd() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
    }    
}