
import React, {
    useState, useRef, useEffect,
  } from 'react';
  import {
     ReactEditor, useSlate,
  } from 'slate-react';
  import {
    Editor, Range,
  } from 'slate';
  import { css } from 'emotion';
  
  import {Portal, Menu} from 'components/common';
  
  import './index.css';

  export const HoveringSuggestion = () => {
    const ref = useRef();
    const editor = useSlate();
    const [subs, setSubs] = useState('');
    
    useEffect(() => {
      const el = ref.current;
      const { selection } = editor;
  
      if (!el) {
        return;
      }
  
      if (
          !ReactEditor.isFocused(editor) ||
          selection && selection.anchor.offset == 0
      ) {
        el.removeAttribute('style');
        return;
      }
  
      const fragments = Editor.fragment(editor, selection);

      const [curPgIdx, curSntIdx] = selection.anchor.path;
      const curPg = editor.children[curPgIdx];
      const curSnt = curPg.children[curSntIdx];
      if (curSnt !== undefined){
        const curSub = curSnt.text.substr(0, selection.anchor.offset).split(" ")
        curSub.pop();
        setSubs(curSub.join(" "));
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
            `}
          >
              <div className="HoveringList-title">{subs}</div>
              <div className="HoveringList">
                <div className="HoveringList-item">Kaffi...</div> 
                <div className="HoveringList-item">Te...</div>
                <div className="HoveringList-item">Appelsín..</div>
                <div className="HoveringList-item">Vatn</div>
              </div>
          </div>
        </Portal>
    );
  };
  