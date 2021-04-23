import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import "./index.css";

import LanguagePicker from "components/LanguagePicker";
import SlateTranslator from "components/SlateTranslator";

function TranslateBox(props) {
  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text">
          <SlateTranslator
            translation={props.translation}
            text={props.text}
            setText={props.setText}
            hoverId={props.hoverId}
            setHoverId={props.setHoverId}
            setPrefix={props.setPrefix}
          />
          {props.clearText && (
            <button className="TranslatorSide-clear" onClick={props.clearText}>
              <span>×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Translator(props) {
  const clearText = () => {
    props.setText([
      {
        type: "paragraph",
        children: [
          {
            id: 0,
            text: "",
            translation: "",
          },
        ],
      },
    ]);
  };

  const switchText = () => {
    const switchedText = props.sourceText.map((pg) => ({
      ...pg,
      children: pg.children.map((s) => ({
        ...s,
        text: s.translation,
        translation: s.text,
      })),
    }));
    props.setText(switchedText);
  };

  return (
    <div className="Translator">
      <LanguagePicker switchText={switchText} />
      <div className="Translator-containers">
        <TranslateBox
          setText={props.setText}
          text={props.sourceText}
          translation={false}
          setHoverId={props.setHoverId}
          hoverId={props.hoverId}
          clearText={clearText}
        />
        <TranslateBox
          setText={props.setText}
          text={props.sourceText}
          translation
          setHoverId={props.setHoverId}
          hoverId={props.hoverId}
          setPrefix={props.setPrefix}
        />
      </div>
    </div>
  );
}

export default Translator;
