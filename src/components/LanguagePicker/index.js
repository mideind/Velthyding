import { switchLanguage } from "features/login/loginSlice";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown } from "semantic-ui-react";
import "./index.css";

function LanguagePicker(props) {
  const { t } = useTranslation();
  const LANGUAGE_OPTIONS = [
    {
      key: "is",
      text: t("Icelandic"),
      value: "is",
      flag: "is",
    },
    {
      key: "en",
      text: t("English"),
      value: "en",
      flag: "uk",
    },
  ];

  const { source, target } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  return (
    <Dropdown
      button
      className="icon"
      floating
      labeled
      icon="world"
      options={LANGUAGE_OPTIONS}
      selection
      value={!props.isSource ? target : source}
      onChange={() => dispatch(switchLanguage())}
      placeholder={props.text}
    />
  );
}

const LanguageDirectionPicker = () => {
  const dispatch = useDispatch();

  return (
    <div className="LanguageDirectionPicker">
      <div className="LanguageDirection">
        <LanguagePicker isSource />
        <span className="LanguageToggle-button">
          <Button
            icon="exchange"
            // We no longer switch the text
            onClick={() => dispatch(switchLanguage())}
          />
        </span>
      </div>
      <div className="LanguageDirection">
        <LanguagePicker />
      </div>
    </div>
  );
};

export default LanguageDirectionPicker;
