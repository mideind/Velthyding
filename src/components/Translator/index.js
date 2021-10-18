import LanguagePicker from "components/LanguagePicker";
import SlateTranslator from "components/SlateTranslator";
import React from "react";
import "./index.css";

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
            <button
              type="submit"
              className="TranslatorSide-clear"
              onClick={props.clearText}
            >
              <span>×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Translator({ sourceText, setText, hoverId, setHoverId }) {
  const clearText = () => {
    setText([
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

  // const switchText = () => {
  //   const switchedText = props.sourceText.map((pg) => ({
  //     ...pg,
  //     children: pg.children.map((s) => ({
  //       ...s,
  //       text: s.translation,
  //       translation: s.text,
  //     })),
  //   }));
  //   props.setText(switchedText);
  // };

  return (
    <div className="Translator">
      <LanguagePicker />
      <div className="Translator-containers">
        <TranslateBox
          setText={setText}
          text={sourceText}
          translation={false}
          setHoverId={setHoverId}
          hoverId={hoverId}
          clearText={clearText}
        />
        <TranslateBox
          setText={setText}
          text={sourceText}
          translation
          setHoverId={setHoverId}
          hoverId={hoverId}
        />
      </div>
    </div>
  );
}

export default Translator;
