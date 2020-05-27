import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import { Dropdown, Button } from 'semantic-ui-react';
import ContentEditable from 'react-contenteditable';


import './index.css';

import { switchLanguage, setHover } from 'features/login/loginSlice';

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

function TranslateSource(props) {
  const [profileState, setProfileState] = useState(props);

  const { hoverId } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    setProfileState(props);
  }, [props]);

  function parseSentences(sentences, idx, target = true) {
    return sentences.map((sent, sidx) => <span onMouseLeave={() => dispatch(setHover(null))} onMouseEnter={() => dispatch(setHover(`${idx}-${sidx}`))} className={`${idx}-${sidx}` === hoverId ? 'active' : ''} >{sent[target ? 1 : 0]}</span>);
  }

  function parseParagraphs(paragraphs, target = true) {
    return paragraphs.map((pg, idx) => <p>{parseSentences(pg, idx, target)}</p>);
  }

  let htmlContent = <p>{props.text}</p>;
  const structuredSource = props.engines.filter((e) => e.selected && e.structuredText !== undefined && e.structuredText.length !== 0);
  if (structuredSource.length !== 0) {
    htmlContent = parseParagraphs(structuredSource[0].structuredText, false);
  }

  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-lang">
        <LanguagePicker isSource text="Source language" />
        <Button icon='exchange' onClick={() => dispatch(switchLanguage())} />
      </div>
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text" onClick={() => props.setEditable(true)}>
          {!profileState.editable && <div className="Translator-text-editor">{htmlContent}</div>}
          {profileState.editable
          && <TextareaAutosize
          lang={profileState.language}
          autoFocus={true}
          tabIndex="110"
          value={props.text}
          onChange={(e) => {
            profileState.setText(e.target.value);
          }}
          acceptCharset="utf-8">
        </TextareaAutosize>}
          {false && <ContentEditable className="Translator-text-editor" onChange={(e) => {
            profileState.setText(e.currentTarget.innerText);
          }}
            html={props.text} />}
          <button className="TranslatorSide-clear" onClick={() => profileState.setText('')}>
            <span>×</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TranslateTarget(props) {
  const { hoverId } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  let htmlContent = <p></p>;
  function parseSentences(sentences, idx, target = true) {
    return sentences.map((sent, sidx) => <span onMouseLeave={() => dispatch(setHover(null))} onMouseEnter={() => dispatch(setHover(`${idx}-${sidx}`))} className={`${idx}-${sidx}` === hoverId ? 'active' : ''}>{sent[target ? 1 : 0]}</span>);
  }

  function parseParagraphs(paragraphs, target = true) {
    return paragraphs.map((pg, idx) => <p>{parseSentences(pg, idx, target)}</p>);
  }

  if (props.structuredText && props.structuredText.length !== 0) {
    // If backend provides structured text, enable highlights
    htmlContent = parseParagraphs(props.structuredText, true);
  } else {
    htmlContent = props.text.map((p) => <p>{p}</p>);
  }
  return (
    <div className={props.text || props.force ? 'TranslatorSide-text-wrapper' : 'hidden'}>
      <button className="TranslatorSide-label"><span>{props.engineName}</span></button>
      <div className="Translator-text-editor">{htmlContent}</div>
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
          engines={engines}
          setSelected={props.setSource}
          editable={props.editable}
          setEditable={props.setEditable}
          />
        <div className="TranslatorSide">
          <div className="TranslatorSide-lang">
            <LanguagePicker text="Target language" />
          </div>
          <div className="TranslatorSide-container">
            <div className="TranslatorSide-text">
              {engines.filter((e) => e.text.length !== 0).filter((e) => e.selected).map((engine) => (<TranslateTarget
                key={engine.name}
                engineName={engine.name}
                language={props.target}
                text={engine.text}
                structuredText={engine.structuredText}
                full={engine.full}
              />))}
              {engines.filter((e) => e.text.length !== 0).length === 0 && <TranslateTarget
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
