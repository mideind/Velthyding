import { loginUser } from "api/index";
import "App.css";
import { login } from "features/login/loginSlice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Button, Divider, Form, Header, Icon } from "semantic-ui-react";
import "./index.css";

function Login({ loggedin }) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  if (loggedin) {
    return <Navigate to="/home" />;
  }
  const apiLogin = (pEmail, pPassword) => {
    loginUser(pEmail, pPassword)
      .then(() => dispatch(login(pEmail)))
      .catch((e) => {
        console.error(e);
        setError(t("Incorrect email or password."));
      });
  };

  const submit = (e) => {
    e.preventDefault();
    apiLogin(email, password);
  };

  return (
    <div className="App-content">
      <div className="Login">
        <div className="Login-content">
          <Header as="h2">
            <Icon name="address book" />
            <Header.Content>{t("Login")}</Header.Content>
          </Header>
          <Form onSubmit={submit}>
            {error && <div className="Message-error">{error}</div>}
            <Form.Field>
              <input
                type="text"
                placeholder={t("Email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Field>

            <Form.Field>
              <input
                type="password"
                placeholder={t("Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Field>
            <Button primary content={t("Login")} type="submit" fluid />
          </Form>
          <Divider />
          <Link to="/register">
            <Button fluid>{t("New account")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
