import React, {
  useMemo, useCallback,
} from 'react';


import { createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { HoveringTooltip } from 'components/HoveringTooltip';
import { HoveringSuggestion } from 'components/HoveringSugestions/ index';


// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) =>
  // Return a value array of children derived by splitting the string.
  string.split('\n').map((line) => ({
    children: [{ text: line, type: 'paragraph' }],
    type: 'paragraph',
  }));


const SentenceElement = (props) => (
  <span
      style={{ backgroundColor: 'yellow', marginRight: '20px' }} {...props.attributes}>
      {props.children}
  </span>
);

const DefaultElement = (props) => (
  <p {...props.attributes}>
  {props.children}
  </p>
);

const Leaf = (props) => {
       return (
      <span
        onMouseOver={() => props.setHoverId(props.leaf.uId)}
        {...props.attributes}
        style={{ 
            marginRight: '5px',
            backgroundColor: (props.hoverId && props.leaf.uId === props.hoverId) ? 'azure' : 'white' 
        }}
      >
        {props.children}
      </span>
)};

const flipTextAndTranslation = (text) => ( text.map(pg => (
  {...pg, children: pg.children.map(c => ({...c, text: c.translation, translation: c.text}))})
));


const withBreak = editor => {
  // Note: this breaks lists etc.
  // CHECK FOR PARAGRAPH if introducing more complex formating.
  editor.insertBreak = () => {
    const newLine = {
        type: "paragraph",
        children: [
            {
                text: "",
                translation: ""
            }
        ]
    };
    Transforms.insertNodes(editor, newLine);
  };
  return editor;
};

const SlateTranslator = (props) => {
  const editor = useMemo(() => withBreak(withReact(createEditor())), []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'sentence': 
        return <SentenceElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const updateHover = (hId) => {
      props.setHoverId(hId)
    }; 

  const renderLeaf = useCallback((lp) => <Leaf {...lp} hoverId={props.hoverId} setHoverId={updateHover} />, [props.hoverId]);

  let content = props.text;
  if (props.translation) {
    content = flipTextAndTranslation(content);
  }

  const updateText = (newValue) => {

      if (props.translation) {
          props.setText(flipTextAndTranslation(newValue));
      } else {
          props.setText(newValue);
      }
  }


  return (
      <div>
        <Slate
            editor={editor}
            value={content}
            onChange={(newValue) => updateText(newValue)}>
            {!props.translation && <HoveringTooltip /> }
            {props.translation && <HoveringSuggestion setPrefix={props.setPrefix} />}
            <Editable
                spellCheck="false"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter text.."
                autoFocus={props.translation ? false : true}
              />
        </Slate>
      </div>
  );
};


export default SlateTranslator;
