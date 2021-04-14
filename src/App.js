import React, { useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { Checkbox, Dropdown, Message } from "semantic-ui-react";
import "semantic-ui-less/semantic.less";
import "./App.css";

import { useSelector, useDispatch } from "react-redux";

import CampaignTask from "features/campaigntask";
import Campaigns from "features/campaigns";
import Translate from "features/translate";
import Login from "features/login";
import Home from "features/home";
import Register from "features/register";

import { logoutUser, checkUser } from "api";
import { toggleGoogle } from "features/login/loginSlice";

import { SHOW_BRANDING, SHOW_LOGIN } from "config";
import { useTranslation } from "react-i18next";
import useCookie from "react-use-cookie";
import mideindLogo from "./mideind.svg";
import logo from "./velthyding_hor.png";

import { setToggle } from "./features/translate/translateSlice";

function VelthydingMenu(props) {
  const { t } = useTranslation();
  return (
    <Dropdown item icon="cog" floating direction="left">
      <Dropdown.Menu>
        <Dropdown.Item>
          <Checkbox
            label={t("show_google_trans", "Show Google Translation")}
            onClick={props.onGoogleClick}
          />
        </Dropdown.Item>
        <Dropdown.Item onClick={props.toggleLanguage}>
          {props.lng === "is" && "English interface"}
          {props.lng !== "is" && "Íslenskt viðmót"}
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/campaigns">{t("Evaluation")}</Link>
        </Dropdown.Item>
        {props.loggedin && (
          <Dropdown.Item onClick={props.logoutUser}>
            {t("Logout")}
          </Dropdown.Item>
        )}
        {!props.loggedin && (
          <Dropdown.Item>
            <Link to="/login"> {t("login_header")}</Link>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function App() {
  const { loggedin } = useSelector((state) => state.login);
  const [lng, setLng] = useCookie(
    "lang",
    window.navigator.language.includes("is") ? "is" : "en"
  );

  const { t, i18n } = useTranslation();
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    setLanguage(lng);
  }, lng);

  const toggleLanguage = () => {
    if (lng === "is") {
      setLng("en");
    } else {
      setLng("is");
    }
  };

  const dispatch = useDispatch();

  const onGoogleClick = () => {
    dispatch(setToggle("Google"));
    dispatch(toggleGoogle());
  };

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
                {SHOW_BRANDING && (
                  <img alt="logo" src={logo} height="40" width="140" />
                )}
                {!SHOW_BRANDING && (
                  <span>
                    {t("fallback_header", "Icelandic - English Translation")}
                  </span>
                )}
              </Link>
            </div>
            <div className="App-header-menu">
              <VelthydingMenu
                onGoogleClick={onGoogleClick}
                logoutUser={logoutUser}
                loggedin={loggedin}
                lng={lng}
              />
              {!SHOW_LOGIN && <span>{t("fallback_login", "Beta")}</span>}
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
            <Route exact path="/campaigns">
              <Campaigns />
            </Route>
            <Route path="/campaigns/:id/:mode">
              <CampaignTask />
            </Route>
            <Route path="/">
              <Translate />
            </Route>
          </Switch>
        </div>

        <div className="App-body disclaimer">
          <Message info size="big">
            <Message.Header>
              {t("disclaimer-header", "About Vélþýðing.is")}
            </Message.Header>
            <p>
              {t(
                "disclaimer-content",
                "This website is under active development. No responsibility is taken for the quality of translations. All translations are made using a neural network and the output can be unpredictable and biased."
              )}
            </p>
            <p>
              {t(
                "disclaimer-cookie",
                "By using this service you agreee to our use of cookies. Translations may be logged for quality assurance purposes."
              )}
            </p>
            <p>{t("disclaimer-last-updated", "Last updated: ")} 2020-02-02</p>
          </Message>
        </div>
        {SHOW_BRANDING && (
          <div className="Footer">
            <div className="Footer-logo">
              <a href="https://mideind.is">
                <img alt="logo" src={mideindLogo} width="67" height="76" />
              </a>
              <p>Miðeind ehf., kt. 591213-1480</p>
              <p>Fiskislóð 31, rými B/303, 101 Reykjavík</p>
              <p>
                <a href="mailto:mideind@mideind.is">mideind@mideind.is</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
