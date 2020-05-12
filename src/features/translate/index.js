import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

import 'App.css';
import Translator from 'components/Translator';

import { translateMany } from 'actions/translations';

import { storeTranslation } from 'api';

import {setTranslation, setToggle, clearAll, translateReducer} from './translateSlice';


function Translate() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [trans, setTrans] = useState([]);
  const [source, setSource] = useState('en');
  const [target, setTarget] = useState('is');

  const engines = useSelector(state => state.engines);
  const dispatch = useDispatch();

  // Refactor when more languages on offer
  useEffect(() => {
    if (target === source) {
      if (source === 'is') {
        setSource('en');
      } else {
        setSource('is')
      }
    }
  }, [target, source]);

  useEffect(() => {
    if (target === source) {
      if (target === 'is') {
        setTarget('en');
      } else {
        setTarget('is')
      }
    }
  }, [source, target]);

  useEffect(() => {
    if (text.trim() === '') {
      dispatch(clearAll());
    }
  }, [text, dispatch]);

  const translateButton = <button
      className="Button TranslateBox-submit"
      onClick={async () => {
        if (!text) {
          return;
        }
        setLoading(true);
        const trans = await translateMany(
          engines.filter(engine => engine.selected),
          text,
          source,
          target,
        );
        trans.map((t) => { 
          return dispatch(setTranslation({name: t.engine.name, text: t.text}));
        })
        setTrans(trans);
        trans.map((t) => {
          return storeTranslation(`${source}-${target}`, t.engine.name, text, t.text.join("\n\n"))
        });
        setLoading(trans === [])
      }}>
      {loading ? <ClipLoader size={10} color={"#FFF"} /> : <span> Translate </span> }
    </button>;

  return (
    <div>
      {translateButton}
      <Translator
        sourceText={text}
        targetText={trans}
        setText={setText}
        setTargetText={setTrans}
        setSource={setSource}
        setTarget={setTarget}
        source={source}
        target={target}
      />
      <div className="Translate">
        <div className="Translate-footer">
          <div className="Translate-engines">
            {engines.map((engine, idx) => (
              <div className="Checkbox" key={'cb-' + idx}>
                <label>
                  <input
                    type="checkbox"
                    checked={engine.selected}
                    onChange={() => dispatch(setToggle(engine.name))}/>
                  {engine.name} - {engine.url}
                </label>
              </div>
            ))}
          </div>
          {translateButton}
        </div>
      </div>
    </div>
  );
}

export default Translate;
