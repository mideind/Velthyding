import {
  setSourceLanguage,
  setTargetLanguage,
  swapLanguages,
} from "features/translate/translateSlice";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown } from "semantic-ui-react";
import "./index.css";

function LanguagePicker(props) {
  return (
    <Dropdown
      button
      className="icon"
      floating
      labeled
      icon="world"
      options={props.languageOptions}
      selection
      value={props.language}
      onChange={props.changeLanguage}
      placeholder={props.text}
    />
  );
}

function LanguageDirectionPicker() {
  const { t } = useTranslation();
  const { sourceLang, targetLang } = useSelector((state) => state.translation);
  const [tgtLanguageOptions, setTgtLanuageOptions] = useState([]);
  const dispatch = useDispatch();
  // TODO: Get this information from the backend
  const SUPPORTED_LANGUAGE_PAIRS = useMemo(() => {
    return {
      en: ["is", "fo"],
      is: ["en", "pl"],
      pl: ["is"],
      fo: ["en"],
    };
  }, []);
  const LANGUAGE_OPTIONS = useMemo(() => {
    return {
      is: {
        key: "is",
        text: t("Icelandic"),
        value: "is",
        flag: "is",
      },
      en: {
        key: "en",
        text: t("English"),
        value: "en",
        flag: "uk",
      },
      pl: {
        key: "pl",
        text: t("Polish"),
        value: "pl",
        flag: "pl",
      },
      fo: {
        key: "fo",
        text: t("Faroese"),
        value: "fo",
        flag: "fo",
      },
    };
  }, [t]);
  useEffect(() => {
    // TODO: Consider moving valid target lang logic to redux
    const validTgtLanguages = SUPPORTED_LANGUAGE_PAIRS[sourceLang];
    setTgtLanuageOptions(validTgtLanguages.map((key) => LANGUAGE_OPTIONS[key]));
    // If the currently selected targetLang is not in our dropdown list select the first as targetLang
    if (validTgtLanguages.indexOf(targetLang) === -1) {
      const newTargetLang = validTgtLanguages[0];
      dispatch(setTargetLanguage(newTargetLang));
    }
  }, [
    sourceLang,
    LANGUAGE_OPTIONS,
    SUPPORTED_LANGUAGE_PAIRS,
    dispatch,
    targetLang,
  ]);
  const SRC_LANGUAGE_OPTIONS = Object.keys(LANGUAGE_OPTIONS).map(
    (key) => LANGUAGE_OPTIONS[key]
  );
  return (
    <div className="LanguageDirectionPicker">
      <div className="LanguageDirection">
        <LanguagePicker
          languageOptions={SRC_LANGUAGE_OPTIONS}
          language={sourceLang}
          changeLanguage={(_, data) => {
            dispatch(setSourceLanguage(data.value));
          }}
        />
        <span className="LanguageToggle-button">
          <Button icon="exchange" onClick={() => dispatch(swapLanguages())} />
        </span>
      </div>
      <div className="LanguageDirection">
        <LanguagePicker
          languageOptions={tgtLanguageOptions}
          language={targetLang}
          changeLanguage={(_, data) => {
            dispatch(setTargetLanguage(data.value));
          }}
        />
      </div>
    </div>
  );
}

export default LanguageDirectionPicker;
