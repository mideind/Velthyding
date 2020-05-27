import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css';

import { useSelector } from 'react-redux';

import Translate from 'features/translate';
import Login from 'features/login';
import Home from 'features/home';

import { logoutUser } from 'api';

import { SHOW_BRANDING, SHOW_LOGIN } from 'config';
import mideindLogo from './mideind.svg';
import logo from './velthyding_hor.png';


function App() {
  const { loggedin, email } = useSelector((state) => state.login);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="App-header-content">
            <div>
              <Link to="/">
                { SHOW_BRANDING && <img alt="logo" src={logo} height="40" width="140" /> }
                { !SHOW_BRANDING && <span>Icelandic - English Translation</span> }
              </Link>
            </div>
            <div className="App-header-menu">
              {(SHOW_LOGIN && !loggedin) && <Link to="/login">Login</Link>}
              {(SHOW_LOGIN && loggedin) && <div><Link to="/home">{email}</Link> / <span onClick={logoutUser}>Logout</span> </div>}
              { !SHOW_LOGIN && <span>Beta</span> }
            </div>
          </div>
        </header>
        <div className="App-body">
          <Switch>
            <Route path="/login">
              {loggedin ? <Redirect to="/home" /> : <Login />}
            </Route>
            <Route path="/home">
              {!loggedin ? <Redirect to="/login" /> : <Home />}
            </Route>
            <Route path="/">
              <Translate />
            </Route>
          </Switch>
        </div>
        { SHOW_BRANDING
        && <div className="Footer">
          <div className="Footer-logo">
            <a href="https://mideind.is"><img alt="logo" src={mideindLogo} width="67" height="76" /></a>
            <p>Miðeind ehf., kt. 591213-1480</p>
            <p>Fiskislóð 31, rými B/304, 101 Reykjavík, <a href="mailto:mideind@mideind.is">mideind@mideind.is</a></p>
          </div>
        </div>}
      </div>
    </Router>
  );
}

export default App;
