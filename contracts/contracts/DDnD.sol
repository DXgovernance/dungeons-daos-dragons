// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.8;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './DDnDNFT.sol';
import 'hardhat/console.sol';

/// @title DDnD
contract DDnD {
  using SafeMath for uint256;
  using Math for uint256;
  using ECDSA for bytes32;
  using SignatureChecker for address;

  /* enum GameState {None, PlayersTurn, MasterTurn, Ended} */

  DDnDNFT public DDnDNFTMinter;

  string public nftTrophyURI = 'nftTrophyURI';
  string public nftDMURI = 'nftDMURI';

  struct Game {
    address[] players;
    uint256 secondsPerTurn;
    uint256 winningPot;
    IERC20 paymentToken;
    uint256 dungeonMasterFee;
    uint256 dungeonMasterArbitrationFee;
    uint256 requiredSignaturesToArbitrate;
    address daoArbitrator;
    uint256 turnNumber;
    uint256 gameState;
    bytes32[] playersState;
    address winner;
  }
  uint256 public gameCount;

  mapping(uint256 => uint256) public lastTimestampUpdate;
  mapping(uint256 => Game) public games;

  constructor(address _DDnDNFT) public {
    DDnDNFTMinter = DDnDNFT(_DDnDNFT);
  }

  function setUpGame(
    address[] memory players,
    uint256 secondsPerTurn,
    uint256 winningPot,
    IERC20 paymentToken,
    uint256 dungeonMasterFee,
    uint256 dungeonMasterArbitrationFee,
    uint256 requiredSignaturesToArbitrate,
    address daoArbitrator,
    bytes[] memory signatures
  ) public {
    require(
      msg.sender == players[0],
      'DDnd: Game can only be created by dungeon master'
    );

    Game memory newGame;
    newGame.players = players;
    newGame.secondsPerTurn = secondsPerTurn;
    newGame.winningPot = winningPot;
    newGame.paymentToken = paymentToken;
    newGame.dungeonMasterFee = dungeonMasterFee;
    newGame.dungeonMasterArbitrationFee = dungeonMasterArbitrationFee;
    newGame.requiredSignaturesToArbitrate = requiredSignaturesToArbitrate;
    newGame.daoArbitrator = daoArbitrator;

    newGame.turnNumber = 0;
    newGame.gameState = 1;
    newGame.playersState = new bytes32[](players.length);
    newGame.winner = address(0);

    gameCount++;

    bytes32 gameStateHash = keccak256(abi.encode(newGame));

    games[gameCount] = newGame;

    require(
      players.length ==
        getValidSignatures(gameCount, gameStateHash, signatures),
      'DDnD: Error in signature verification'
    );

    // Take the players fee
    uint256 playerFee = newGame.winningPot.div(newGame.players.length);
    for (uint256 i = 1; i < newGame.players.length; i++) {
      newGame.paymentToken.transferFrom(
        newGame.players[i],
        address(this),
        playerFee
      );
    }

    // Save the game in storage because everything is right
    lastTimestampUpdate[gameCount] = block.timestamp;
  }

  function setGameState(
    uint256 gameId,
    uint256 turnNumber,
    uint256 gameState,
    bytes32[] memory playersState,
    address winner,
    bytes[] memory signatures
  ) public {
    uint256 turnsThatPassed = turnNumber - games[gameId].turnNumber;
    require(
      block.timestamp >
        lastTimestampUpdate[gameCount].add(
          (turnNumber.sub(games[gameId].turnNumber)).mul(
            games[gameId].secondsPerTurn
          )
        ),
      'DDnD: Wrong time to update'
    );

    // Get the future hash of the game
    bytes32 gameStateHash =
      getFutureGameStateHash(
        gameId,
        turnNumber,
        gameState,
        winner,
        playersState
      );

    // Check that the signatures match the future state of the game
    if (msg.sender != games[gameId].daoArbitrator) {
      require(
        games[gameId].players.length >
          getValidSignatures(gameId, gameStateHash, signatures),
        'DDnD: Error in signature verification'
      );
    } else if (gameState == 3) {
      require(
        games[gameId].requiredSignaturesToArbitrate >=
          getValidSignatures(gameId, gameStateHash, signatures),
        'DDnD: Error in signature verification'
      );
    }

    // Everything is valid, change the game state
    games[gameId].turnNumber = turnNumber;
    games[gameId].gameState = gameState;
    games[gameId].playersState = playersState;
    games[gameId].winner = winner;
    lastTimestampUpdate[gameId] = block.timestamp;

    // If the game finish, transfer the tokens
    if (games[gameId].gameState == 3) {
      // Finish game

      if (msg.sender == games[gameId].daoArbitrator) {
        games[gameId].paymentToken.transfer(
          games[gameId].daoArbitrator,
          games[gameId].dungeonMasterArbitrationFee
        );
        games[gameId].paymentToken.transfer(
          games[gameId].players[0],
          games[gameId].dungeonMasterFee.sub(
            games[gameId].dungeonMasterArbitrationFee
          )
        );
      } else {
        games[gameId].paymentToken.transfer(
          games[gameId].players[0],
          games[gameId].dungeonMasterFee
        );
      }
      games[gameId].paymentToken.transfer(
        games[gameId].winner,
        games[gameId].winningPot.sub(games[gameId].dungeonMasterFee)
      );

      DDnDNFTMinter.mint(games[gameId].players[0], nftDMURI);
      DDnDNFTMinter.mint(games[gameId].winner, nftTrophyURI);
    }
  }

  function getGameHash(
    address[] memory players,
    uint256 secondsPerTurn,
    uint256 winningPot,
    IERC20 paymentToken,
    uint256 dungeonMasterFee,
    uint256 dungeonMasterArbitrationFee,
    uint256 requiredSignaturesToArbitrate,
    address daoArbitrator,
    uint256 turnNumber,
    uint256 gameState,
    bytes32[] memory playersState,
    address winner
  ) public view returns (bytes32) {
    Game memory _game;
    _game.players = players;
    _game.secondsPerTurn = secondsPerTurn;
    _game.winningPot = winningPot;
    _game.paymentToken = paymentToken;
    _game.dungeonMasterFee = dungeonMasterFee;
    _game.dungeonMasterArbitrationFee = dungeonMasterArbitrationFee;
    _game.requiredSignaturesToArbitrate = requiredSignaturesToArbitrate;
    _game.daoArbitrator = daoArbitrator;
    _game.turnNumber = 0;
    _game.gameState = 1;
    _game.playersState = new bytes32[](players.length);
    _game.winner = address(0);

    return keccak256(abi.encode(_game));
  }

  function getFutureGameStateHash(
    uint256 gameId,
    uint256 turnNumber,
    uint256 gameState,
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
    for (uint256 i = 0; i < signatures.length; i++) {
      console.log('Signer', games[gameId].players[i], i);
      if (
        games[gameId].players[i].isValidSignatureNow(
          gameStateHash.toEthSignedMessageHash(),
          signatures[i]
        )
      ) {
        console.log('Valid Sgnature', i);
        validSignatures++;
      }
    }
  }
}
