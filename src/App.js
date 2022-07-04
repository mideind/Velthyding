import { checkUser, logoutUser, resetCSRFCookie } from "api";
import Disclaimer from "components/Disclaimer";
import Footer from "components/Footer";
import Header from "components/Header";
import Campaigns from "features/campaigns";
import CampaignTask from "features/campaigntask";
import Home from "features/home";
import { changeLanguage } from "features/i18n/languageSettingSlice";
import Login from "features/login";
import { login, logout } from "features/login/loginSlice";
import Register from "features/register";
import Translator from "features/translate";
import { useEffect } from "react";
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
  const { i18n } = useTranslation();
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

  const logoutAction = () => {
    logoutUser().finally(() => dispatch(logout()));
  };

  useEffect(() => {
    resetCSRFCookie()
      .then((_status) => {
        checkUser()
          .then((email) => {
            if (email) {
              dispatch(login(email));
            }
          })
          .catch((_err) => {
            dispatch(logout());
          });
      })
      .catch((_err) => {
        console.log("Unable to reset CSRF cookie");
      });
  }, [dispatch]);

  return (
    <div className="App">
      <Header
        toggleLanguage={toggleLanguage}
        logoutUser={logoutAction}
        loggedin={loggedin}
        lng={lang}
      />
      <div className="App-body">
        <Routes>
          <Route path="/">
            <Route index element={<Translator />} />
            <Route path="login" element={<Login loggedin={loggedin} />} />
            <Route path="home" element={<Home loggedin={loggedin} />} />
            <Route path="register" element={<Register loggedin={loggedin} />} />
            <Route
              path="campaigns"
              element={<Campaigns loggedin={loggedin} />}
            />
            <Route path="campaigns/:id/:mode" element={<CampaignTask />} />
          </Route>
        </Routes>
      </div>
      <Disclaimer />
      <Footer />
    </div>
  );
}

export default App;
