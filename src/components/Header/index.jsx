import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import logo from "../../velthyding_hor.png";

function VelthydingMenu(props) {
  const { t } = useTranslation();
  return (
    <Dropdown item icon="cog" floating direction="left">
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.toggleLanguage}>
          {props.lng === "is" && "English interface"}
          {props.lng !== "is" && "Íslenskt viðmót"}
        </Dropdown.Item>
        <Dropdown.Item text={t("Evaluation")} as={Link} to="/campaigns" />
        {props.loggedin && (
          <Dropdown.Item text={t("Home")} as={Link} to="/home" />
        )}
        {props.loggedin && (
          <Dropdown.Item onClick={props.logoutUser} as={Link} to="/">
            {t("Logout")}
          </Dropdown.Item>
        )}
        {!props.loggedin && (
          <Dropdown.Item text={t("login_header")} as={Link} to="/login" />
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
export default function Header(props) {
  return (
    <header className="App-header">
      <div className="App-header-content">
        <div>
          <Link to="/">
            <img alt="logo" src={logo} height="50" width="175" />
          </Link>
        </div>
        <div className="App-header-menu">
          <VelthydingMenu
            toggleLanguage={props.toggleLanguage}
            logoutUser={props.logoutUser}
            loggedin={props.loggedin}
            lng={props.lng}
          />
        </div>
      </div>
    </header>
  );
}
