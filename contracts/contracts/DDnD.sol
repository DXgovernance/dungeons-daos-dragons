// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./DDnDNFT.sol";

/// @title DDnD
contract DDnD {
    using SafeMath for uint256;
    using Math for uint256;
    using ECDSA for bytes32;
    
    enum GameState {None, PlayersTurn, MasterTurn, Ended}
    
    DDnDNFT public DDnDNFTMinter;

    struct Game {
      address dungeonMaster;
      address[] players;
      uint256 secondsPerTurn;
      uint256 winningPot;
      IERC20 paymentToken;
      uint256 dungeonMasterFee;
      uint256 dungeonMasterArbitrationFee;
      uint256 requiredSignaturesToArbitrate;
      address daoArbitrator;
      string nftTrophyURI;
      string nftDMURI;
      
      uint256 turnNumber;
      GameState gameState;
      bytes32[] playersState;
      address winner;
    }
    uint256 public gameCount;
    
    mapping(uint256 => Game) public games;
    
    constructor(address _DDnDNFT) public {
      DDnDNFTMinter = DDnDNFT(_DDnDNFT);
    }
    
    function setUpGame(
      address dungeonMaster,
      address[] memory players,
      uint256 secondsPerTurn,
      uint256 winningPot,
      IERC20 paymentToken,
      uint256 dungeonMasterFee,
      uint256 dungeonMasterArbitrationFee,
      uint256 requiredSignaturesToArbitrate,
      address daoArbitrator,
      string memory nftTrophyURI,
      string memory nftDMURI,
      bytes[] memory signatures
    ) public {
      require(msg.sender == dungeonMaster, "DDnd: Game can only be created by dungeon master");
      
      Game memory newGame;
      newGame.dungeonMaster = dungeonMaster;
      newGame.players = players;
      newGame.secondsPerTurn = secondsPerTurn;
      newGame.winningPot = winningPot;
      newGame.paymentToken = paymentToken;
      newGame.dungeonMasterFee = dungeonMasterFee;
      newGame.dungeonMasterArbitrationFee = dungeonMasterArbitrationFee;
      newGame.requiredSignaturesToArbitrate = requiredSignaturesToArbitrate;
      newGame.daoArbitrator = daoArbitrator;
      newGame.nftTrophyURI = nftTrophyURI;
      newGame.nftDMURI = nftDMURI;
      
      newGame.turnNumber = 0;
      newGame.gameState = GameState.PlayersTurn;
      newGame.playersState = new bytes32[](players.length);
      newGame.winner = address(0);
      
      gameCount ++;
      
      bytes32 gameStateHash = keccak256(abi.encode(newGame));
      
      require( 
        players.length > getValidSignatures(gameCount, gameStateHash, signatures),
        "DDnD: Error in signature verification"
      );
      
      // Take the players fee
      uint256 playerFee = newGame.winningPot
        .div(newGame.players.length);
      for (uint i = 0; i < newGame.players.length; i ++) {
        newGame.paymentToken.transferFrom(newGame.players[i], address(this), playerFee);
      }

      // Save the game in storage because everything is right
      games[gameCount] = newGame;
    }
    
    function setGameState(
      uint256 gameId,
      uint256 turnNumber,
      GameState gameState,
      bytes32[] memory playersState,
      address winner,
      bytes[] memory signatures
    ) public {
      
      // Get the future hash of the game
      bytes32 gameStateHash = getFutureGameStateHash(gameId, turnNumber, gameState, winner, playersState);
      
      // Check that the signatures match the future state of the game
      if (msg.sender != games[gameId].daoArbitrator) {
        require( 
          games[gameId].players.length > getValidSignatures(gameId, gameStateHash, signatures),
          "DDnD: Error in signature verification"
          );
      } else if (gameState == GameState.Ended) {
        require( 
          games[gameId].requiredSignaturesToArbitrate >= getValidSignatures(gameId, gameStateHash, signatures),
          "DDnD: Error in signature verification"
          );
      }
      
      // Everything is valid, change the game state
      games[gameId].turnNumber = turnNumber;
      games[gameId].gameState = gameState;
      games[gameId].playersState = playersState;
      games[gameId].winner = winner;

      // If the game finish, transfer the tokens
      if (games[gameId].gameState == GameState.Ended) {
        // Finish game
        
        if (msg.sender == games[gameId].daoArbitrator) {
          games[gameId].paymentToken
            .transfer(games[gameId].daoArbitrator, games[gameId].dungeonMasterArbitrationFee);
          games[gameId].paymentToken
            .transfer(games[gameId].dungeonMaster, games[gameId].dungeonMasterFee.sub(games[gameId].dungeonMasterArbitrationFee));
        } else {
          games[gameId].paymentToken.transfer(games[gameId].dungeonMaster, games[gameId].dungeonMasterFee);
        }
        games[gameId].paymentToken.transfer(games[gameId].winner, games[gameId].winningPot.sub(games[gameId].dungeonMasterFee));
      
        DDnDNFTMinter.mint(games[gameId].dungeonMaster, games[gameId].nftDMURI);
        DDnDNFTMinter.mint(games[gameId].winner, games[gameId].nftTrophyURI);
      }

    }
    
    function getFutureGameStateHash(
      uint256 gameId,
      uint256 turnNumber,
      GameState gameState,
      address winner,
      bytes32[] memory playersState
    ) public view returns (bytes32) {
      Game memory updatedGame = games[gameId];
      
      updatedGame.turnNumber = turnNumber;
      updatedGame.gameState = gameState;
      updatedGame.playersState = playersState;
      updatedGame.winner = winner;
      
      return keccak256(abi.encode(updatedGame));
    }
    
    function getValidSignatures(
      uint256 gameId,
      bytes32 gameStateHash,
      bytes[] memory signatures
    ) public view returns (uint256 validSignatures) {
      for (uint i = 0; i < signatures.length; i ++) {
        if (
          ((i == 0) && (games[gameId].dungeonMaster != gameStateHash.toEthSignedMessageHash().recover(signatures[0])))
          ||
          (games[gameId].players[i.sub(1)] != gameStateHash.toEthSignedMessageHash().recover(signatures[i]))
        ) {
          validSignatures ++;
        }
      }
    }

}
