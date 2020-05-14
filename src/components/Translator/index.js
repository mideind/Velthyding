import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';

import './index.css';


function LanguagePicker(props) {
  const [profileState, setProfileState] = useState({ setSelected: props.setSelected, selected: props.selected });

  const [open, setOpen] = useState(false);
  const options = [{ key: 'is', name: 'Icelandic' }, { key: 'en', name: 'English' }];
  const langs = { is: 'Icelandic', en: 'English' };

  useEffect(() => {
    setProfileState(props);
  }, [props]);

  return (
    <div onClick={() => setOpen(!open)} className="LanguagePicker">
      <div className="LanguagePicker-container">{langs[profileState.selected]} ⋁</div>
      {open
        && <div className="LanguagePicker-menu">
          {options.map((o) => (
            <div onClick={() => props.setSelected(o.key)}
              className="LanguagePicker-menu-item">
              {o.name}
            </div>))}
        </div>}
    </div>
  );
}


function TranslateSource(props) {
  const [profileState, setProfileState] = useState(props);

  useEffect(() => {
    setProfileState(props);
  }, [props]);

  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-lang">
        Translate from  <LanguagePicker selected={profileState.language} setSelected={props.setSelected} />
      </div>
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text">
          <TextareaAutosize
            lang={profileState.language}
            autoFocus={true}
            tabIndex="110"
            value={props.text}
            onChange={(e) => {
              profileState.setText(e.target.value);
            }}
            acceptCharset="utf-8">
          </TextareaAutosize>
          <button className="TranslatorSide-clear" onClick={() => profileState.setText('')}>
            <span>×</span>
          </button>
        </div>
      </div>
    </div>
  );
}


function TranslateTarget(props) {
  return (
    <div className={props.text || props.force ? 'TranslatorSide-text-wrapper' : 'hidden'} key={`transKey-${props.engineName}`}>
      < button className="TranslatorSide-clear"><span>{props.engineName}</span></button>
      <TextareaAutosize
        lang={props.language}
        tabIndex="110"
        value={props.text.join('\n\n')}
        acceptCharset="utf-8">
      </TextareaAutosize>
    </div >
  );
}


function Translator(props) {
  const engines = useSelector((state) => state.engines);
  return (
    <div className="Translator">
      <div className="Translator-container">
        <TranslateSource
          language={props.source}
          setText={props.setText}
          text={props.sourceText}
          setSelected={props.setSource} />
        <div className="TranslatorSide">
          <div className="TranslatorSide-lang">
            Translate to <LanguagePicker selected={props.target} setSelected={props.setTarget} />
          </div>
          <div className="TranslatorSide-container">
            <div className="TranslatorSide-text">
              {engines.filter((e) => e.selected).map((engine) => (<TranslateTarget
                  key={engine.name}
                  engineName={engine.name}
                  language={props.target}
                  text={engine.txt}
                />))}
              {engines.filter((e) => e.txt !== '').length === 0 && <TranslateTarget
                force={true}
                engineName=""
                language={props.target}
                text={props.transformerT}
                setText={props.setTransformer}
              />}
            </div>
          </div>
        </div>


      </div>
    </div >
  );
}


export default Translator;
