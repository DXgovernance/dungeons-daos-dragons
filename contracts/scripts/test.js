const hre = require('hardhat');
const fs = require('fs');
const web3 = hre.web3;
let moment = require('moment');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BN = web3.utils.BN;
const { time } = require('@openzeppelin/test-helpers');

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_UINT_256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const ANY_FUNC_SIGNATURE = '0xaaaaaaaa';
const NULL_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const DDnD = artifacts.require('DDnD.sol');
const DDnDNFT = artifacts.require('DDnDNFT.sol');
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const ERC20Guild = artifacts.require('ERC20Guild.sol');

function toEthSignedMessageHash(messageHex) {
  const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
  const prefix = Buffer.from(
    `\u0019Ethereum Signed Message:\n${messageBuffer.length}`
  );
  return web3.utils.sha3(Buffer.concat([prefix, messageBuffer]));
}

async function main() {
  const accounts = await web3.eth.getAccounts();

  console.log(accounts);

  // Deploy DDnD
  console.log('Deploying DDnD...');
  const ddndNFT = await DDnDNFT.new();
  const ddnd = await DDnD.new(ddndNFT.address);
  console.log('DDnD deployed to:', ddnd.address);

  // Deploy GuildA token
  const guildASingleOwner = accounts[1];
  const guildAToken = await ERC20Mock.new(
    guildASingleOwner,
    web3.utils.toWei('100'),
    'GuildA',
    'DDnDA'
  );
  const guildA = await ERC20Guild.new();
  await guildA.initialize(
    guildAToken.address, // address _token,
    moment.duration(1, 'hours').asSeconds(), // uint256 _proposalTime,
    moment.duration(1, 'days').asSeconds(), // uint256 _timeForExecution,
    web3.utils.toWei('10'), // uint256 _votesForExecution,
    web3.utils.toWei('1'), // uint256 _votesForCreation,
    'GuildA', // string memory _name,
    0, // uint256 _voteGas,
    0, // uint256 _maxGasPrice,
    1 // uint256 _lockTime
  );
  const guildATokenVault = await guildA.tokenVault();
  await guildAToken.approve(guildATokenVault, web3.utils.toWei('100'), {
    from: guildASingleOwner,
  });
  await guildA.lockTokens(web3.utils.toWei('100'), { from: guildASingleOwner });

  // Deploy GuildB token
  const guildBSingleOwner = accounts[1];

  const guildBToken = await ERC20Mock.new(
    guildBSingleOwner,
    web3.utils.toWei('100'),
    'GuildB',
    'DDnDB'
  );
  const guildB = await ERC20Guild.new();
  await guildB.initialize(
    guildBToken.address, // address _token,
    moment.duration(1, 'hours').asSeconds(), // uint256 _proposalTime,
    moment.duration(1, 'days').asSeconds(), // uint256 _timeForExecution,
    web3.utils.toWei('10'), // uint256 _votesForExecution,
    web3.utils.toWei('1'), // uint256 _votesForCreation,
    'GuildB', // string memory _name,
    0, // uint256 _voteGas,
    0, // uint256 _maxGasPrice,
    1 // uint256 _lockTime
  );
  const guildBTokenVault = await guildB.tokenVault();
  await guildBToken.approve(guildBTokenVault, web3.utils.toWei('100'), {
    from: guildBSingleOwner,
  });
  await guildB.lockTokens(web3.utils.toWei('100'), { from: guildBSingleOwner });

  const paymentToken = await ERC20Mock.new(
    accounts[0],
    web3.utils.toWei('100'),
    'PaymentToken',
    'DDnDPayment'
  );
  await paymentToken.transfer(guildA.address, web3.utils.toWei('50'));
  await paymentToken.transfer(guildB.address, web3.utils.toWei('50'));

  const dungeonMaster = accounts[3];
  const daoArbitrator = accounts[4];

  const setUpGameHash = await ddnd.getGameHash(
    [dungeonMaster, guildA.address, guildB.address],
    moment.duration(1, 'days').asSeconds(),
    web3.utils.toWei('50'),
    paymentToken.address,
    10,
    2,
    2,
    daoArbitrator,
    0,
    1,
    [NULL_HASH, NULL_HASH, NULL_HASH],
    NULL_ADDRESS
  );

  console.log('Setup game hash', setUpGameHash);

  const setUpDDnDFromGuildA = await guildA.createProposal(
    [paymentToken.address, guildA.address],
    [
      web3.eth.abi.encodeFunctionCall(
        {
          name: 'approve',
          type: 'function',
          inputs: [
            {
              type: 'address',
              name: 'recipient',
            },
            {
              type: 'uint256',
              name: 'amount',
            },
          ],
        },
        [ddnd.address, web3.utils.toWei('25')]
      ),
      web3.eth.abi.encodeFunctionCall(
        {
          name: 'setEIP1271SignedHash',
          type: 'function',
          inputs: [
            {
              type: 'bytes32',
              name: '_hash',
            },
          ],
        },
        [toEthSignedMessageHash(setUpGameHash)]
      ),
    ],
    ['0', '0'],
    'Desc',
    setUpGameHash,
    { from: guildASingleOwner }
  );
  console.log(
    'Set up DDnD proposal form guild A',
    setUpDDnDFromGuildA.logs[0].args.proposalId
  );

  const setUpDDnDFromGuildB = await guildB.createProposal(
    [paymentToken.address, guildB.address],
    [
      web3.eth.abi.encodeFunctionCall(
        {
          name: 'approve',
          type: 'function',
          inputs: [
            {
              type: 'address',
              name: 'recipient',
            },
            {
              type: 'uint256',
              name: 'amount',
            },
          ],
        },
        [ddnd.address, web3.utils.toWei('25')]
      ),
      web3.eth.abi.encodeFunctionCall(
        {
          name: 'setEIP1271SignedHash',
          type: 'function',
          inputs: [
            {
              type: 'bytes32',
              name: '_hash',
            },
          ],
        },
        [toEthSignedMessageHash(setUpGameHash)]
      ),
    ],
    ['0', '0'],
    'Desc',
    setUpGameHash,
    { from: guildBSingleOwner }
  );
  console.log(
    'Set up DDnD proposal form guild B',
    setUpDDnDFromGuildB.logs[0].args.proposalId
  );

  await time.increase(moment.duration(1, 'hours').asSeconds());

  const proposalSetUpFromGuildA = await guildA.endProposal(
    setUpDDnDFromGuildA.logs[0].args.proposalId
  );
  console.log(proposalSetUpFromGuildA.logs[0].args);

  const proposalSetUpFromGuildB = await guildB.endProposal(
    setUpDDnDFromGuildB.logs[0].args.proposalId
  );
  console.log(proposalSetUpFromGuildB.logs[0].args);

  const signatures = [
    await web3.eth.sign(setUpGameHash, dungeonMaster),
    await web3.eth.sign(setUpGameHash, guildASingleOwner),
    await web3.eth.sign(setUpGameHash, guildBSingleOwner),
  ];
  await ddnd.setUpGame(
    [dungeonMaster, guildA.address, guildB.address],
    moment.duration(1, 'days').asSeconds(),
    web3.utils.toWei('50'),
    paymentToken.address,
    10,
    2,
    2,
    daoArbitrator,
    signatures,
    { from: dungeonMaster }
  );

  ////////////////////////////////// TURN ONE //////////////////////////////////

  const DM_TURN_ONE_INSTRUCTIONS = web3.utils.sha3('DM_TURN_ONE_INSTRUCTIONS');

  const TURN_ONE_PROPOSAL_GUILD_A = (
    await guildA.createProposal(
      [guildA.address],
      [
        web3.eth.abi.encodeFunctionCall(
          {
            name: 'setEIP1271SignedHash',
            type: 'function',
            inputs: [
              {
                type: 'bytes32',
                name: '_hash',
              },
            ],
          },
          [toEthSignedMessageHash(web3.utils.sha3('GUILD_A_TURN_ONE_ACTION'))]
        ),
      ],
      ['0'],
      'Desc',
      web3.utils.sha3('GUILD_A_TURN_ONE_ACTION'),
      { from: guildASingleOwner }
    )
  ).logs[0].args.proposalId;
  console.log('Turn ONE proposal action guild A', TURN_ONE_PROPOSAL_GUILD_A);

  const TURN_ONE_PROPOSAL_GUILD_B = (
    await guildB.createProposal(
      [guildB.address],
      [
        web3.eth.abi.encodeFunctionCall(
          {
            name: 'setEIP1271SignedHash',
            type: 'function',
            inputs: [
              {
                type: 'bytes32',
                name: '_hash',
              },
            ],
          },
          [toEthSignedMessageHash(web3.utils.sha3('GUILD_B_TURN_ONE_ACTION'))]
        ),
      ],
      ['0'],
      'Desc',
      web3.utils.sha3('GUILD_B_TURN_ONE_ACTION'),
      { from: guildBSingleOwner }
    )
  ).logs[0].args.proposalId;
  console.log('Turn ONE proposal action guild B', TURN_ONE_PROPOSAL_GUILD_B);

  await time.increase(moment.duration(1, 'hours').asSeconds());

  await guildA.endProposal(TURN_ONE_PROPOSAL_GUILD_A);

  await guildB.endProposal(TURN_ONE_PROPOSAL_GUILD_B);

  const TURN_ONE_HASH = await ddnd.getFutureGameStateHash(
    1, // uint256 gameId,
    1, // uint256 turnNumber,
    1, // uint256 gameState,
    [
      DM_TURN_ONE_INSTRUCTIONS,
      web3.utils.sha3('GUILD_A_TURN_ONE_ACTION'),
      web3.utils.sha3('GUILD_B_TURN_ONE_ACTION'),
    ], // bytes32[] memory playersState
    NULL_ADDRESS, // address winner,
    { from: dungeonMaster }
  );

  const TURN_ONE_SIGNATURES = [
    await web3.eth.sign(TURN_ONE_HASH, dungeonMaster),
    await web3.eth.sign(
      web3.utils.sha3('GUILD_A_TURN_ONE_ACTION'),
      guildASingleOwner
    ),
    await web3.eth.sign(
      web3.utils.sha3('GUILD_B_TURN_ONE_ACTION'),
      guildBSingleOwner
    ),
  ];

  console.log('TURN ONE HASH', TURN_ONE_HASH);

  await ddnd.setGameState(
    1, // uint256 gameId,
    1, // uint256 turnNumber,
    1, // uint256 gameState,
    [
      web3.utils.sha3('DM_TURN_ONE_INSTRUCTIONS'),
      web3.utils.sha3('GUILD_A_TURN_ONE_ACTION'),
      web3.utils.sha3('GUILD_B_TURN_ONE_ACTION'),
    ], // bytes32[] memory playersState
    NULL_ADDRESS, // address winner,
    TURN_ONE_SIGNATURES,
    [
      web3.utils.sha3('DM_TURN_TWO_INSTRUCTIONS'),
      web3.utils.sha3('GUILD_A_TURN_TWO_START'),
      web3.utils.sha3('GUILD_B_TURN_TWO_START'),
    ],
    { from: dungeonMaster }
  );

  ////////////////////////////////// TURN TWO //////////////////////////////////

  const DM_TURN_TWO_INSTRUCTIONS = web3.utils.sha3('DM_TURN_TWO_INSTRUCTIONS');

  const TURN_TWO_PROPOSAL_GUILD_A = (
    await guildA.createProposal(
      [guildA.address],
      [
        web3.eth.abi.encodeFunctionCall(
          {
            name: 'setEIP1271SignedHash',
            type: 'function',
            inputs: [
              {
                type: 'bytes32',
                name: '_hash',
              },
            ],
          },
          [toEthSignedMessageHash(web3.utils.sha3('GUILD_A_TURN_TWO_ACTION'))]
        ),
      ],
      ['0'],
      'Desc',
      web3.utils.sha3('GUILD_A_TURN_TWO_ACTION'),
      { from: guildASingleOwner }
    )
  ).logs[0].args.proposalId;
  console.log('Turn TWO proposal action guild B', TURN_TWO_PROPOSAL_GUILD_A);

  const TURN_TWO_PROPOSAL_GUILD_B = (
    await guildB.createProposal(
      [guildB.address],
      [
        web3.eth.abi.encodeFunctionCall(
          {
            name: 'setEIP1271SignedHash',
            type: 'function',
            inputs: [
              {
                type: 'bytes32',
                name: '_hash',
              },
            ],
          },
          [toEthSignedMessageHash(web3.utils.sha3('GUILD_B_TURN_TWO_ACTION'))]
        ),
      ],
      ['0'],
      'Desc',
      web3.utils.sha3('GUILD_B_TURN_TWO_ACTION'),
      { from: guildBSingleOwner }
    )
  ).logs[0].args.proposalId;
  console.log('Turn TWO proposal action guild B', TURN_TWO_PROPOSAL_GUILD_B);

  await time.increase(moment.duration(1, 'hours').asSeconds());

  await guildA.endProposal(TURN_TWO_PROPOSAL_GUILD_A);

  await guildB.endProposal(TURN_TWO_PROPOSAL_GUILD_B);

  const TURN_TWO_HASH = await ddnd.getFutureGameStateHash(
    1, // uint256 gameId,
    2, // uint256 turnNumber,
    1, // uint256 gameState,
    [
      DM_TURN_TWO_INSTRUCTIONS,
      web3.utils.sha3('GUILD_A_TURN_TWO_ACTION'),
      web3.utils.sha3('GUILD_B_TURN_TWO_ACTION'),
    ], // bytes32[] memory playersState
    NULL_ADDRESS, // address winner,
    { from: dungeonMaster }
  );

  const TURN_TWO_SIGNATURES = [
    await web3.eth.sign(TURN_TWO_HASH, dungeonMaster),
    await web3.eth.sign(
      web3.utils.sha3('GUILD_A_TURN_TWO_ACTION'),
      guildASingleOwner
    ),
    await web3.eth.sign(
      web3.utils.sha3('GUILD_B_TURN_TWO_ACTION'),
      guildBSingleOwner
    ),
  ];

  console.log('TURN TWO HASH', TURN_TWO_HASH);

  await ddnd.setGameState(
    1, // uint256 gameId,
    2, // uint256 turnNumber,
    1, // uint256 gameState,
    [
      web3.utils.sha3('DM_TURN_TWO_INSTRUCTIONS'),
      web3.utils.sha3('GUILD_A_TURN_TWO_ACTION'),
      web3.utils.sha3('GUILD_B_TURN_TWO_ACTION'),
    ], // bytes32[] memory playersState
    NULL_ADDRESS, // address winner,
    TURN_TWO_SIGNATURES,
    [
      web3.utils.sha3('DM_TURN_THREE_INSTRUCTIONS'),
      web3.utils.sha3('GUILD_A_TURN_THREE_START'),
      web3.utils.sha3('GUILD_B_TURN_THREE_START'),
    ],
    { from: dungeonMaster }
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
