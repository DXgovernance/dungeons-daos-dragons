// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.8;

contract MessageLogger {
    event Message(bytes32 indexed topic, bytes message);
    function broadcast(bytes32 topic, bytes memory message) public {
      emit Message(topic, message);
    }
}
