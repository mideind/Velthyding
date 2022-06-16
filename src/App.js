import { checkUserAndCookie, logoutUser } from "api";
import Disclaimer from "components/Disclaimer";
import Footer from "components/Footer";
import Header from "components/Header";
import Campaigns from "features/campaigns";
import CampaignTask from "features/campaigntask";
import Home from "features/home";
import Login from "features/login";
import Register from "features/register";
import Translate from "features/translate";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import useCookie from "react-use-cookie";
import "semantic-ui-less/semantic.less";
import "./App.css";

function App() {
  const { loggedin } = useSelector((state) => state.login);
  const [lng, setLng] = useCookie(
    "lang",
    window.navigator.language.includes("is") ? "is" : "en"
  );

  const { _t, i18n } = useTranslation();
  useEffect(() => {
    const setLanguage = (lang) => {
      i18n.changeLanguage(lang);
    };
    setLanguage(lng);
  }, [lng, i18n]);

  const toggleLanguage = () => {
    if (lng === "is") {
      setLng("en");
    } else {
      setLng("is");
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
        lng={lng}
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
