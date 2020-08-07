import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Button } from 'semantic-ui-react';
import { switchLanguage } from 'features/login/loginSlice';

import './index.css';

const LANGUAGE_OPTIONS = [
  {
    key: 'is', text: 'Icelandic', value: 'is', flag: 'is',
  },
  {
    key: 'en', text: 'English', value: 'en', flag: 'uk',
  },
];


function LanguagePicker(props) {
  const { source, target } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  return (
    <Dropdown
      button
      className='icon'
      floating
      labeled
      icon='world'
      options={LANGUAGE_OPTIONS}
      selection
      value={!props.isSource ? target : source}
      onChange={() => dispatch(switchLanguage())}
      placeholder={props.text}
      clearText={props.clearText}
    />
  );
}

const LanguageDirectionPicker = (props) => {
  const dispatch = useDispatch();

  return (
    <div className="LanguageDirectionPicker">
      <div className="LanguageDirection">
        <LanguagePicker isSource />
        <Button icon='exchange' onClick={() => dispatch(switchLanguage()) && props.clearText()} />
      </div>
      <div className="LanguageDirection">
        <LanguagePicker />
      </div>
    </div>
  );
};

export default LanguageDirectionPicker;
