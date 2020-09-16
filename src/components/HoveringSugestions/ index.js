
import React, {
    useState, useRef, useEffect,
  } from 'react';
  import {
     ReactEditor, useSlate,
  } from 'slate-react';
  import {
    Editor, Range, Transforms, Text
  } from 'slate';
import { css } from 'emotion';

import {Portal, Menu} from 'components/common';

import './index.css';
import getSuggestions from 'actions/suggestions';
import { translate } from 'actions/translations';
import { ENGINES } from 'config';

const insertSuggestion = (editor, sug, location) => {
  console.log(sug)
  Transforms.delete(editor, {unit: "word"});
  Transforms.insertText(
    editor,
    sug,
    { match: Text.isText, split: false }
  );
  Transforms.deselect(editor);
};


const SuggestionButton = ( { suggestion, prefix } ) => {
  const editor = useSlate();

  translate(ENGINES[1], prefix + suggestion, "")

  return (
    <div 
      className={css`
        color: #333;
        border-bottom: 1px solid rgba(0,0,0,.1);
        padding-bottom: 4px;
        padding-top: 4px;
        padding-left: 9px;
        padding-right: 9px;
        line-height: 1.2;
        transition: background-color 100ms;
        cursor: pointer;
        `}
      className="HoveringList-item"
      onMouseDown={ event => {
        event.preventDefault()
        insertSuggestion(editor, suggestion)
      }}>{suggestion} ...</div> 
  )
};



export const HoveringSuggestion = () => {
  const ref = useRef();
  const editor = useSlate();
  const [curPrefix, setCurPrefix] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const updateSuggestions = (newSuggestions) => {
    if ( JSON.stringify(newSuggestions) != JSON.stringify(suggestions) ) {
      setSuggestions(newSuggestions);
    }
  }

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    
    if (!el ) {
      setSuggestions([]);
      return;
    }

    if (
      !selection || !ReactEditor.isFocused(editor) ||
      (selection && selection.anchor.offset == 0)
    ) {
      el.removeAttribute('style');
      return;
    }

    //const fragments = Editor.fragment(editor, selection);

    const [curPgIdx, curSntIdx] = selection.anchor.path;
    const curPg = editor.children[curPgIdx];
    const curSnt = curPg.children[curSntIdx];
    if (curSnt !== undefined) {
      const curSub = curSnt.text.substr(0, selection.anchor.offset).split(" ");
      const curSubPost = curSnt.text.substr(selection.anchor.offset, curSnt.text.length).split(" ");
      curSubPost.shift();
      curSub.pop();
      
      const prefix = curSub.join(" ") + " "
      const mskSnt = prefix + "<mask> " + curSubPost.join(" ");
      setCurPrefix(prefix);

      getSuggestions(
        curSnt.text,
        mskSnt
      ).then((resp) => updateSuggestions(resp.suggestions))
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset + 28}px`;
    el.style.left = `${rect.left
        + window.pageXOffset
        - el.offsetWidth / 2
        + rect.width / 2}px`;
  });

  return (
    <Portal>
      <div
        ref={ref}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1000;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          overflow-x: hidden;
          scrollbar-width: thin;
          box-shadow: 1px 2px 10px rgba(0,0,0,.15);
          outline: none;
          background: white;
          border-radius: 4px;
          color: black;
          max-width: 300px;
          min-width: 100px;
          min-height: 150px;
        `}
      >
          <div className="HoveringList">
            {suggestions.map((sug, idx) => <SuggestionButton key={"sug-" + idx} suggestion={sug} prefix={curPrefix}/> )}
          </div>
      </div>
    </Portal>
  );
};
