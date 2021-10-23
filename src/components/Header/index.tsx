import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Web3ConnectStatus from '../Web3ConnectStatus';
import { useContext } from '../../contexts';
import { FiSettings, FiUser, FiBarChart2 } from 'react-icons/fi';
import dragon from 'assets/images/dragon.png';
import Web3 from 'web3';
import { Select,Box } from 'retro-ui'


// import { Box } from '../../components/common';


const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0px 0px 0px;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--nav-text-light);
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
`;

const ItemBox = styled(Box)`
  color: var(--dark-text-gray);
  padding: 5px 10px;
  font-weight: 500;
  font-size: 16px;
  margin-right: 10px;
  height: 28px;
  border-radius: 6px;
`;
const StyledLogo=styled.img`
width:26px;
height:26px;
`
const StyledNavBox=styled(Box)`
padding:0;
margin-top:17px;
margin-left:10px;
`

// const abi= [{
//     inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
//     name: 'votesOf',
//     outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   }]
const SelectStyle=styled(Select)`
font-size:9px !important;
    
`

const Header = observer(() => {

  const {
    context: {
      userStore,
      providerStore,
      blockchainStore,
      configStore,
      // daoStore,
    },
  } = useContext();
      console.log(providerStore)
  const { active, account } = providerStore.getActiveWeb3React();

  // useEffect(()=>{
  //   async function fetchUserVotes(){
  //     const proposalData = {
  //       to: [
  //         contracts.controller,
  //         account,
  //         tokens.find(token => token.symbol === 'DXD').address,
  //         contracts.utils.dxdVestingFactory,
  //       ],
  //       data: [repCallData, '0x0', dxdApprovalCallData, vestingCallData],
  //
  //       account: [address
  //
  //       ],
  //       titleText: localStorage.getItem('dxvote-newProposal-title'),
  //       descriptionHash: contentHash.fromIpfs(hash),
  //     };
  //     const contract = await new library.eth.Contract(abi,'0xa327ea1b9986d81750E9A6FdeAb1305589BFC260');
  //     contract.methods.votesOf().send({from: ....})
  //       .on('receipt', function(){
  //       ...
  //       });
  //    // const guildContract=new ethers.Contract('0xa327ea1b9986d81750E9A6FdeAb1305589BFC260', abi, library).connect(library)
  //     //const guildContract=new ethers.Contract('0xa327ea1b9986d81750E9A6FdeAb1305589BFC260', abi, library)
  //      const vote= await guildContract.votesOf(account)
  //     console.log('wooooorkkkss',vote)
  //
  //   }
  //   fetchUserVotes()
  // },[])

  const NavItem = withRouter(({ route, history, children }) => {
    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          history.push(route);
        }}
      >
        {' '}
        {children}{' '}
      </div>
    );
  });



  if (!active) {
    return (
      <NavWrapper>
        <NavSection>
          <NavItem route={`/`}>
            <MenuItem>
              🐉
            </MenuItem>
          </NavItem>
        </NavSection>
        <NavSection>
          <Web3ConnectStatus text="Connect Wallet" />
          <NavItem route={`/config`}>
            <a>
              <FiSettings style={{ margin: '0px 10px', color: '#616161' }} />
            </a>
          </NavItem>
        </NavSection>
      </NavWrapper>
    );
  } else {
    const networkName = configStore.getActiveChainName();
    const userInfo = userStore.getUserInfo();
    const votingMachines = blockchainStore.initialLoadComplete
      ? configStore.getNetworkContracts().votingMachines
      : {};

    const dxdBalance =
      active && userInfo.dxdBalance
        ? parseFloat(
            Number(Web3.utils.fromWei(userInfo.dxdBalance.toString())).toFixed(
              2
            )
          )
        : 0;
    // const genBalance =
    //   active && userInfo.genBalance
    //     ? parseFloat(
    //         Number(Web3.utils.fromWei(userInfo.genBalance.toString())).toFixed(
    //           2
    //         )
    //       )
    //     : 0;
    // const { userRep, totalSupply } =
    //   active && blockchainStore.initialLoadComplete
    //     ? daoStore.getRepAt(account, providerStore.getCurrentBlockNumber())
    //     : { userRep: bnum(0), totalSupply: bnum(0) };
    // const repPercentage = active
    //   ? userRep.times(100).div(totalSupply).toFixed(4)
    //   : bnum(0);

    return (
      <NavWrapper>
        <NavSection>
          <NavItem route={`/${networkName}/guild`}>
            <MenuItem>
              <StyledLogo alt="dxdao" src={dragon} />
            </MenuItem>
          </NavItem>
        </NavSection>


        {blockchainStore.initialLoadComplete ? (
          <NavSection>
            {account && (
              <>
                {votingMachines.dxd ? (
                  <ItemBox> {dxdBalance} VOTE </ItemBox>
                ) : (
                  <div />
                )}


                {/*{votingMachines.gen ? (*/}
                {/*  <ItemBox> {genBalance} GEN </ItemBox>*/}
                {/*) : (*/}
                {/*  <div />*/}
                {/*)}*/}
                {/*<ItemBox> {repPercentage.toString()} % REP </ItemBox>*/}
              </>
            )}
            <Web3ConnectStatus text="Connect Wallet" />
            <NavItem route={`/dungeon-master`}>
              <ItemBox> Dungeon Master </ItemBox>
            </NavItem>
            <NavItem route={`/${networkName}/info`}>
              <a>
                <FiBarChart2 style={{ margin: '0px 10px', color: '#616161' }} />
              </a>
            </NavItem>
            <NavItem route={`/config`}>
              <a>
                <FiSettings style={{ margin: '0px 10px', color: '#616161' }} />
              </a>
            </NavItem>
            {account && (
              <NavItem route={`/${networkName}/user/${account}`}>
                <a>
                  <FiUser style={{ margin: '0px 10px', color: '#616161' }} />
                </a>
              </NavItem>
            )}
          </NavSection>
        ) : (

          <NavSection>
            <MenuItem style={{fontSize:'10px'}}>
              <SelectStyle name="Choose Guild">
                <option label="Guild 1">{'Guild1'}</option>
                <option label="Guild 2">{'Guild2'}</option>
              </SelectStyle>
            </MenuItem>
            <NavItem route={`/dungeon-master`}>
              <StyledNavBox> Dungeon Master </StyledNavBox>
            </NavItem>

            {/*<Web3ConnectStatus text="Connect Wallet" />*/}
            {/*<NavItem route={`/config`}>*/}
            {/*  <a>*/}
            {/*    <FiSettings style={{ margin: '0px 10px', color: '#616161' }} />*/}
            {/*  </a>*/}
            {/*</NavItem>*/}
          </NavSection>
        )}
      </NavWrapper>
    );
  }
});

export default Header;
