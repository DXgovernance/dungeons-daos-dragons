import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Web3ConnectStatus from '../Web3ConnectStatus';
import { useContext } from '../../contexts';
import { FiSettings } from 'react-icons/fi';
import { Select, Box } from 'retro-ui';

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
  font-size: x-large;
  line-height: 19px;
  cursor: pointer;
`;

const StyledNavBox = styled(Box)`
  padding: 0;
  margin-top: 17px;
  margin-left: 10px;
`;

const SelectStyle = styled(Select)`
  font-size: 9px !important;
`;

const Header = observer(() => {
  const {
    context: { providerStore, configStore },
  } = useContext();
  console.log(providerStore);
  const { active } = providerStore.getActiveWeb3React();

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
            <MenuItem>🐉</MenuItem>
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

    return (
      <NavWrapper>
        <NavSection>
          <NavItem route={`/${networkName}/guild`}>
            <MenuItem>🏰 🏛️ 🐉</MenuItem>
          </NavItem>
        </NavSection>

        <NavSection>
          <MenuItem style={{ fontSize: '10px' }}>
            <SelectStyle name="Choose Guild">
              <option label="Guild 1">{'Guild1'}</option>
              <option label="Guild 2">{'Guild2'}</option>
            </SelectStyle>
          </MenuItem>
          <NavItem route={`/${networkName}/dungeon-master`}>
            <StyledNavBox> Dungeon Master </StyledNavBox>
          </NavItem>

          <Web3ConnectStatus text="Connect Wallet" />
          {/*<NavItem route={`/config`}>*/}
          {/*  <a>*/}
          {/*    <FiSettings style={{ margin: '0px 10px', color: '#616161' }} />*/}
          {/*  </a>*/}
          {/*</NavItem>*/}
        </NavSection>
      </NavWrapper>
    );
  }
});

export default Header;
