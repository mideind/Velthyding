import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from 'features/login/loginSlice';
import { registerUser } from 'api/index';
import './index.css';
import 'App.css';
import { Header, Button, Divider, Form, Label, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const apiRegister = (email, password) => {
    registerUser(email, password).then(
      () => (
        dispatch(login(email))
      )
    ).catch((error) => {
      setError(t("Incorrect email or password"));
    });
  }

  const submit = (e) => {
    e.preventDefault();

    if (email !== email2) {
      setError(t("Email adddresses don't match"))
      return;
    }

    if (password !== password2) {
      setError(t("Passwords don't match"))
      return;
    }

    apiRegister(email, password);
  }

  return (
    <div className="App-content">
      <div className="Login">
        <div className="Login-content">
          <Header as='h2'>
            <Icon name='address book' />
            <Header.Content>
              {t("New account")}
              <Header.Subheader>{t("Get full access")}</Header.Subheader>
            </Header.Content>
          </Header>
          
          <Form onSubmit={submit}>
          {error && <div className="Message-error">{error}</div>}
            <Form.Field>
              <input type='text' placeholder={t('Email')} value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Field>

            <Form.Field>
              <input type='text' placeholder={t('Repeat email')} value={email2} onChange={(e) => setEmail2(e.target.value)} />
            </Form.Field>

            <Form.Field>
              <input type="password" placeholder={t("Password")} value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </Form.Field>

            <Form.Field>
              <input type="password" placeholder={t("Repeat password")} value={password2} onChange={(e) => setPassword2(e.target.value)}></input>
            </Form.Field>
            <Button primary content={t('Register')} type="submit" fluid />
          </Form>
          <Divider />
        </div>
      </div>
    </div>
  )
}

export default Register;
