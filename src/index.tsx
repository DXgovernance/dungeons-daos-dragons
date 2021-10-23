import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { createWeb3ReactRoot } from '@web3-react/core';
import Web3ReactManager from 'components/Web3ReactManager';
import Web3 from 'web3';
import moment from 'moment';
import { ThemeWrapper } from 'retro-ui';

import * as serviceWorker from './serviceWorker';

import 'index.css';
import ThemeProvider, { GlobalStyle } from './theme';

import { web3ContextNames } from 'provider/connectors';

import Header from './components/Header';
import Footer from './components/Footer';
import PageRouter from './PageRouter';

import { GuildMain } from './components/Guild/GuildMain';
import { DungeonMaster } from './components/Guild/guildComponents/DungeonMaster';

moment.updateLocale('en', {
  relativeTime: {
    s: '1 second',
    m: '1 minute',
    h: '1 hour',
    d: '1 day',
  },
});

const Web3ProviderInjected = createWeb3ReactRoot(web3ContextNames.injected);

function getLibrary(provider) {
  return new Web3(provider);
}

const Routes = () => {
  return (
    <PageRouter>
      <Route exact path="/:network/dungeon-master">
        {' '}
        <DungeonMaster />{' '}
      </Route>
      <Route exact path="/:network/guild">
        {' '}
        <GuildMain />{' '}
      </Route>
      <Footer />
    </PageRouter>
  );
};

const Root = (
  <Web3ProviderInjected getLibrary={getLibrary}>
    <ThemeWrapper>
      <ThemeProvider>
        <GlobalStyle />
        <HashRouter>
          <Switch>
            <Web3ReactManager>
              <Header />
              <Routes />
            </Web3ReactManager>
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </ThemeWrapper>
  </Web3ProviderInjected>
);
ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
