// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface ILottery {
    function activate(uint ticketCost) external;
    function getTicketCost() view external returns(uint);
    function pickWinner() external;
    function buyTicket(string calldata playerName) external payable;
}