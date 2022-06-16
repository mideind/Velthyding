import { checkUserAndCookie, logoutUser } from "api";
import Disclaimer from "components/Disclaimer";
import Footer from "components/Footer";
import Header from "components/Header";
import Campaigns from "features/campaigns";
import CampaignTask from "features/campaigntask";
import Home from "features/home";
import { changeLanguage } from "features/i18n/languageSettingSlice";
import Login from "features/login";
import Register from "features/register";
import Translate from "features/translate";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "semantic-ui-less/semantic.less";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { loggedin } = useSelector((state) => state.login);
  const { lang } = useSelector((state) => state.language);

  // eslint-disable-next-line
  const { _t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleLanguage = () => {
    if (lang === "is") {
      dispatch(changeLanguage("en"));
    } else {
      dispatch(changeLanguage("is"));
    }
  };

  useEffect(() => {
    checkUserAndCookie();
  }, [loggedin]);

  return (
    <div className="App">
      <Header
        toggleLanguage={toggleLanguage}
        logoutUser={logoutUser}
        loggedin={loggedin}
        lng={lang}
      />
      <div className="App-body">
        <Routes>
          <Route path="/">
            <Route index element={<Translate />} />
            <Route path="login" element={<Login />}>
              {/* {loggedin ? <Redirect to="/home" /> : } */}
            </Route>
            <Route path="/home" element={<Home />}>
              {/* {!loggedin ? <Redirect to="/login" /> : } */}
            </Route>
            <Route path="/register" element={<Register />}>
              {/* {loggedin ? <Redirect to="/home" /> : } */}
            </Route>
            <Route exact path="/campaigns" element={<Campaigns />}>
              {/* {!loggedin ? <Redirect to="/login" /> : } */}
            </Route>
            <Route path="/campaigns/:id/:mode" element={<CampaignTask />}>
              {/* {!loggedin ? <Redirect to="/login" /> : } */}
            </Route>
          </Route>
        </Routes>
      </div>
      <Disclaimer />
      <Footer />
    </div>
  );
}

export default App;
