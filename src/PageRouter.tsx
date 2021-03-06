import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useLocation, useHistory } from 'react-router-dom';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useContext } from './contexts';
import PulsingIcon from './components/common/LoadingIcon';
// import { GlobalLoadingState } from './stores/NotificationStore';

const PageRouterWrapper = styled.div`
  flex: 1;
`;

const LoadingBox = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;

  .loader {
    text-align: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 18px;
    color: var(--dark-text-gray);
    padding: 25px 0px;

    svg {
      margin-bottom: 10px;
    }
  }
`;

// const LoadingProgressText = styled.div`
//   font-size: 14px;
//   margin-top: 8px;
// `;

const PageRouter = observer(({ children }) => {
  const {
    context: {
      providerStore,
      configStore,
      ipfsService,
      messageService
    },
  } = useContext();

  const history = useHistory();
  const location = useLocation();
  const noLoading = ['/guild', '/dungeon-master', '/forum'];

  // Start or auth services
  ipfsService.start();

  messageService.read();

  const { active: providerActive, connector } =
    providerStore.getActiveWeb3React();

  if (noLoading.indexOf(location.pathname) > -1) {
    return <PageRouterWrapper> {children} </PageRouterWrapper>;
  } else if (!providerActive)
    return (
      <PageRouterWrapper>
        <LoadingBox>
          <div className="loader">
            {' '}
            <PulsingIcon size={80} inactive={true} /> <br /> Connect to your
            wallet{' '}
          </div>
        </LoadingBox>
      </PageRouterWrapper>
    );
  else {
    const networkName = configStore.getActiveChainName();
    if (location.pathname === '/') {
      history.push(`/${networkName}/guild`);
    }

    if (
      location.pathname.split('/')[1] &&
      location.pathname.split('/')[1] !== networkName &&
      connector instanceof InjectedConnector
    ) {
      history.push(`/${networkName}/dungeon-master`);
    }
    return <PageRouterWrapper> {children} </PageRouterWrapper>;
  }
});

export default PageRouter;
