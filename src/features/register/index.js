import { registerUser } from "api/index";
import "App.css";
import { login } from "features/login/loginSlice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Divider, Form, Header, Icon } from "semantic-ui-react";
import "./index.css";

function Register({ loggedin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  if (loggedin) {
    return <Navigate to="/home" />;
  }
  const apiRegister = (pEmail, pPassword) => {
    registerUser(pEmail, pPassword)
      .then(() => dispatch(login(pEmail)))
      .catch((errorMsg) => {
        console.log(errorMsg);
        setError(t("Incorrect email or password"));
      });
  };

  const submit = (e) => {
    e.preventDefault();

    if (email !== email2) {
      setError(t("Email adddresses don't match"));
      return;
    }

    if (password !== password2) {
      setError(t("Passwords don't match"));
      return;
    }

    apiRegister(email, password);
  };

  return (
    <div className="App-content">
      <div className="Login">
        <div className="Login-content">
          <Header as="h2">
            <Icon name="address book" />
            <Header.Content>
              {t("New account")}
              <Header.Subheader>{t("Get full access")}</Header.Subheader>
            </Header.Content>
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
                type="text"
                placeholder={t("Repeat email")}
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
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

            <Form.Field>
              <input
                type="password"
                placeholder={t("Repeat password")}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Field>
            <Button primary content={t("Register")} type="submit" fluid />
          </Form>
          <Divider />
        </div>
      </div>
    </div>
  );
}

export default Register;
