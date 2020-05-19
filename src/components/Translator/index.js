import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import { Dropdown } from 'semantic-ui-react';
import ContentEditable from 'react-contenteditable';

import './index.css';

import { switchLanguage } from 'features/login/loginSlice';

function LanguagePicker(props) {
  const { source, target } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const options = [
    {
      key: 'is', text: 'Icelandic', value: 'is', flag: 'is',
    },
    {
      key: 'en', text: 'English', value: 'en', flag: 'uk',
    },
  ];

  return (
    <Dropdown
      button
      className='icon'
      floating
      labeled
      icon='world'
      options={options}
      selection
      value={!props.isSource ? target : source}
      onChange={() => dispatch(switchLanguage())}
      placeholder={props.text}
    />
  );
}


function TranslateSourceTextArea(props) {
  const [profileState, setProfileState] = useState(props);

  useEffect(() => {
    setProfileState(props);
  }, [props]);

  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-lang">
        <LanguagePicker isSource text="Source language" />
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

function TranslateSource(props) {
  const [profileState, setProfileState] = useState(props);

  useEffect(() => {
    setProfileState(props);
  }, [props]);

  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-lang">
        <LanguagePicker isSource text="Source language" />
      </div>
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text">

          <ContentEditable className="Translator-text-editor" onChange={(e) => {
            profileState.setText(e.currentTarget.innerText);
          }}
            html={props.text} />
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
    <div className={props.text || props.force ? 'TranslatorSide-text-wrapper' : 'hidden'}>
      <button className="TranslatorSide-clear"><span>{props.engineName}</span></button>
      <ContentEditable
        disabled
        className="Translator-text-editor"
        html={props.text.join('<br /><br />')} />
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
            <LanguagePicker text="Target language" />
          </div>
          <div className="TranslatorSide-container">
            <div className="TranslatorSide-text">
              {engines.filter((e) => e.txt.length !== 0).filter((e) => e.selected).map((engine) => (<TranslateTarget
                key={engine.name}
                engineName={engine.name}
                language={props.target}
                text={engine.txt}
              />))}
              {engines.filter((e) => e.txt.length !== 0).length === 0 && <TranslateTarget
                force={true}
                engineName=""
                language={props.target}
                text={[]}
              />}
            </div>
          </div>
        </div>


      </div>
    </div >
  );
}


export default Translator;
