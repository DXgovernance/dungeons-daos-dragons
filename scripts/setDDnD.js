const hre = require('hardhat');
const web3 = hre.web3;
let moment = require('moment');
const { time } = require('@openzeppelin/test-helpers');

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_UINT_256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const ANY_FUNC_SIGNATURE = '0xaaaaaaaa';
const NULL_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const TEST_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

const DDnD = artifacts.require('DDnD.sol');
const DDnDNFT = artifacts.require('DDnDNFT.sol');
const ERC20Mock = artifacts.require('ERC20Mock.sol');
const ERC20Guild = artifacts.require('ERC20Guild.sol');
const MessageLogger = artifacts.require('MessageLogger.sol');

function toEthSignedMessageHash(messageHex) {
  const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
  const prefix = Buffer.from(
    `\u0019Ethereum Signed Message:\n${messageBuffer.length}`
  );
  return web3.utils.sha3(Buffer.concat([prefix, messageBuffer]));
}

async function createProposals(guild, creator, proposedActions) {
  return await Promise.all(proposedActions.map( async (proposedAction) => {
    return (await guild.createProposal(
      [guild.address],
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
          [toEthSignedMessageHash(web3.utils.sha3(proposedActions))]
        ),
      ],
      ['0'],
      proposedAction,
      TEST_HASH,
      { from: creator }
    )).logs[0].args.proposalId;
  }));
}

async function main() {
  const accounts = await web3.eth.getAccounts();

  const genesisAccount = accounts[0];
  const tokenOwner1 = accounts[1];
  const tokenOwner2 = accounts[2];
  const tokenOwner3 = accounts[3];
  const tokenOwner4 = accounts[4];
  const tokenOwner5 = accounts[5];
  const tokenOwner6 = accounts[6];
  const tokenOwner7 = accounts[7];
  const tokenOwner8 = accounts[8];
  const dungeonMaster = accounts[9];
  const daoArbitrator = accounts[10];
  
  // Deploy DDnD
  console.log('Deploying DDnD...');
  const ddndNFT = await DDnDNFT.new();
  const messageLogger = await MessageLogger.new();
  const ddnd = await DDnD.new(ddndNFT.address, messageLogger.address);
  console.log('DDnD deployed to:', ddnd.address);

  // Deploy Parking Lot Dao
  const PLDGuildToken = await ERC20Mock.new(
    genesisAccount,
    web3.utils.toWei('100'),
    'Parking Lot DAO',
    'PLD'
  );
  await PLDGuildToken.transfer(tokenOwner1, web3.utils.toWei('30'));
  await PLDGuildToken.transfer(tokenOwner2, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner3, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner4, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner5, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner6, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner7, web3.utils.toWei('10'));
  await PLDGuildToken.transfer(tokenOwner8, web3.utils.toWei('10'));
  
  await ddnd.createGuild(
    PLDGuildToken.address, // address _token,
    moment.duration(1, 'hours').asSeconds(), // uint256 _proposalTime,
    moment.duration(1, 'days').asSeconds(), // uint256 _timeForExecution,
    web3.utils.toWei('10'), // uint256 _votesForExecution,
    web3.utils.toWei('1'), // uint256 _votesForCreation,
    'Parking Lot Guild', // string memory _name,
    0, // uint256 _voteGas,
    0, // uint256 _maxGasPrice,
    1 // uint256 _lockTime
  );
  const PLDGuild = await ERC20Guild.at(await ddnd.guilds(0));
  const PLDGuildTokenVault = await PLDGuild.tokenVault();
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('30'), {
    from: tokenOwner1,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner2,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner3,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner4,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner5,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner6,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner7,
  });
  await PLDGuildToken.approve(PLDGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner8,
  });
  
  await PLDGuild.lockTokens(web3.utils.toWei('30'), { from: tokenOwner1 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner2 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner3 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner4 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner5 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner6 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner7 });
  await PLDGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner8 });

  // Deploy Doyaya guild
  const DoyayaGuildToken = await ERC20Mock.new(
    genesisAccount,
    web3.utils.toWei('100'),
    'Doyaya',
    'DYY'
  );
  await DoyayaGuildToken.transfer(tokenOwner1, web3.utils.toWei('30'));
  await DoyayaGuildToken.transfer(tokenOwner2, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner3, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner4, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner5, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner6, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner7, web3.utils.toWei('10'));
  await DoyayaGuildToken.transfer(tokenOwner8, web3.utils.toWei('10'));
  
  await ddnd.createGuild(
    DoyayaGuildToken.address, // address _token,
    moment.duration(1, 'hours').asSeconds(), // uint256 _proposalTime,
    moment.duration(1, 'days').asSeconds(), // uint256 _timeForExecution,
    web3.utils.toWei('10'), // uint256 _votesForExecution,
    web3.utils.toWei('1'), // uint256 _votesForCreation,
    'Doyaya Guild', // string memory _name,
    0, // uint256 _voteGas,
    0, // uint256 _maxGasPrice,
    1 // uint256 _lockTime
  );
  const DoyayaGuild = await ERC20Guild.at(await ddnd.guilds(1));

  const DoyayaGuildTokenVault = await DoyayaGuild.tokenVault();
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('30'), {
    from: tokenOwner1,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner2,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner3,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner4,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner5,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner6,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner7,
  });
  await DoyayaGuildToken.approve(DoyayaGuildTokenVault, web3.utils.toWei('10'), {
    from: tokenOwner8,
  });
  
  await DoyayaGuild.lockTokens(web3.utils.toWei('30'), { from: tokenOwner1 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner2 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner3 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner4 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner5 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner6 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner7 });
  await DoyayaGuild.lockTokens(web3.utils.toWei('10'), { from: tokenOwner8 });


  const paymentToken = await ERC20Mock.new(
    accounts[0],
    web3.utils.toWei('100'),
    'PaymentToken',
    'DDnDPayment'
  );
  
  await paymentToken.transfer(PLDGuild.address, web3.utils.toWei('50'));
  await paymentToken.transfer(DoyayaGuild.address, web3.utils.toWei('50'));

  const INITIAL_HASH = "QmdfuxY5wGwxowZA4mnbfr642rpp7ccP91mAVLvzDKrk31";
  const GAME_TOPIC = web3.utils.soliditySha3(dungeonMaster, PLDGuild.address, DoyayaGuild.address, "1");
  const DM_TURN_ONE_INSTRUCTIONS = web3.utils.sha3(INITIAL_HASH);
  await messageLogger.broadcast(GAME_TOPIC, INITIAL_HASH, {from: dungeonMaster});
  const setUpGameHash = await ddnd.getGameHash(
    [dungeonMaster, PLDGuild.address, DoyayaGuild.address],
    moment.duration(1, 'days').asSeconds(),
    web3.utils.toWei('50'),
    paymentToken.address,
    10,
    2,
    2,
    daoArbitrator,
    0,
    1,
    [DM_TURN_ONE_INSTRUCTIONS, NULL_HASH, NULL_HASH],
    NULL_ADDRESS
  );

  console.log('Setup game hash', setUpGameHash);

  const setUpDDnDFromGuildA = await PLDGuild.createProposal(
    [paymentToken.address, PLDGuild.address],
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
    { from: tokenOwner1 }
  );

  const setUpDDnDFromGuildB = await DoyayaGuild.createProposal(
    [paymentToken.address, DoyayaGuild.address],
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
    { from: tokenOwner1 }
  );

  await time.increase(moment.duration(1, 'hours').asSeconds());

  await PLDGuild.endProposal(
    setUpDDnDFromGuildA.logs[0].args.proposalId
  );

  await DoyayaGuild.endProposal(
    setUpDDnDFromGuildB.logs[0].args.proposalId
  );

  const signatures = [
    await web3.eth.sign(setUpGameHash, dungeonMaster),
    await web3.eth.sign(setUpGameHash, tokenOwner1),
    await web3.eth.sign(setUpGameHash, tokenOwner1),
  ];

  await ddnd.setUpGame(
    [dungeonMaster, PLDGuild.address, DoyayaGuild.address],
    moment.duration(1, 'days').asSeconds(),
    web3.utils.toWei('50'),
    paymentToken.address,
    10,
    2,
    2,
    daoArbitrator,
    signatures,
    DM_TURN_ONE_INSTRUCTIONS,
    { from: dungeonMaster }
  );
  
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
