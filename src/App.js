import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import { Button, Checkbox, Icon, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import './App.css';

import { useSelector, useDispatch } from 'react-redux';

import { setToggle } from './features/translate/translateSlice';

import Translate from 'features/translate';
import Login from 'features/login';
import Home from 'features/home';
import Register from 'features/register';

import { logoutUser, checkUser } from 'api';
import { toggleGoogle } from 'features/login/loginSlice';

import { SHOW_BRANDING, SHOW_LOGIN } from 'config';
import mideindLogo from './mideind.svg';
import logo from './velthyding_hor.png';

import { useTranslation } from 'react-i18next';

import useCookie from 'react-use-cookie';

function App() {
  const { loggedin, email } = useSelector((state) => state.login);
  const [ lng, setLng ] = useCookie('lang', window.navigator.language.includes('is') ? 'is' : 'en');

  const { t, i18n } = useTranslation();
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }
  useEffect(() => {
    setLanguage(lng)
  }, lng);

  const toggleLanguage = () => {
    if (lng === 'is') {
      setLng('en');
    } else {
      setLng('is')
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Router>
        <div className="App">
        <header className="App-header">
          <div className="App-header-content">
            <div>
              <Link to="/">
                { SHOW_BRANDING && <img alt="logo" src={logo} height="40" width="140" /> }
                { !SHOW_BRANDING && <span>{t('fallback_header', 'Icelandic - English Translation')}</span> }
              </Link>
            </div>
            <div className="App-header-menu">
               {<Dropdown item icon='cog' floating direction="left">
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Checkbox
                      label={t('show_google_trans', 'Show Google Translation')}
                      onClick={() => {dispatch(setToggle('Google')) && dispatch(toggleGoogle());}}/>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={toggleLanguage}>
                    {lng === 'is' && 'English interface'}
                    {lng !== 'is' && 'Íslenskt viðmót'}
                  </Dropdown.Item>
                  {loggedin &&
                  <Dropdown.Item onClick={logoutUser}>
                    {t('Logout')}
                  </Dropdown.Item>}
                  {!loggedin &&
                   <Dropdown.Item>
                    <Link to="/login"> {t('login_header')}</Link>
                  </Dropdown.Item>}
                 
                </Dropdown.Menu>
              </Dropdown>}
              { !SHOW_LOGIN && <span>{t('fallback_login', 'Beta')}</span> }
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
            <Route path="/register">
              {loggedin ? <Redirect to="/home" /> : <Register />}
            </Route>
            <Route path="/">
              <Translate />
            </Route>
          </Switch>
        </div>
        { SHOW_BRANDING
        && <div className="Footer">
             <div className="Footer-logo">
             <a href="https://mideind.is"><img alt="logo" src={mideindLogo} width="50" height="76" /></a>
             <p>Miðeind ehf., kt. 591213-1480<br />
              Fiskislóð 31, rými B/304, 101 Reykjavík, <a href="mailto:mideind@mideind.is">mideind@mideind.is</a><br />
               <a href="presskit.html">{t('press', 'Press material')}.</a>
             </p>
          </div>
        </div>}
      </div>
    </Router>
  );
}

export default App;
