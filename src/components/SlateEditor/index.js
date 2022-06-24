import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Transforms } from "slate";
import { Editable, Slate } from "slate-react";
import _ from "underscore";

/**
 * Useful functions for the SlateEditor.
 */
export const SlateEditorFuncs = {
  getInitialTextNodes() {
    return [
      {
        type: "paragraph",

        children: [
          {
            id: 0,
            uId: "0-0",
            text: "",
          },
        ],
      },
    ];
  },
  resetEditor(editor) {
    // We delete all the nodes in the editor
    _.range(editor.children.length).forEach((_idx) =>
      Transforms.removeNodes(editor, {
        at: [0],
      })
    );
    // And add the initial node again.
    this.AppendTextNodes(editor, this.getInitialTextNodes());
    // Maybe we need to manually set the selection at the end.
    // TODO: Check if this is necessary
  },
  AppendTextNodes(editor, textNodes) {
    // If we have only the initial node, we remove it and add the others.
    if (this.isEmpty(editor)) {
      Transforms.removeNodes(editor, {
        at: [0],
      });
    }

    Transforms.insertNodes(editor, textNodes, { at: [editor.children.length] });
    // Maybe we need to manually set the selection at the end.
    // TODO: Check if this is necessary
  },
  apiResponseToTextNodes(translationResponse) {
    const ApiStructuredSourceTextIdx = 0;
    const ApiStructuredTranslatedTextIdx = 1;
    //     {
    //     "translations": [
    //       {
    //         "translatedText": "feafeafdsa",
    //         "translatedTextStructured": [
    //           [
    //             "asdfaefaef",
    //             "feafeafdsa"
    //           ]
    //         ]
    //       }
    //     ],
    //     "sourceLanguageCode": "en",
    //     "targetLanguageCode": "is",
    //     "model": "mbart25-cont"
    //   }
    return {
      sourceText: translationResponse.translations.map(
        (paragraph, paragraphIdx) => ({
          type: "paragraph",
          children: paragraph.translatedTextStructured.map(
            (sentence, sentenceIdx) => ({
              id: sentenceIdx,
              uId: `${paragraphIdx}-${sentenceIdx}`,
              text: sentence[ApiStructuredSourceTextIdx],
            })
          ),
        })
      ),
      translatedText: translationResponse.translations.map(
        (paragraph, paragraphIdx) => ({
          type: "paragraph",
          children: paragraph.translatedTextStructured.map(
            (sentence, sentenceIdx) => ({
              id: sentenceIdx,
              uId: `${paragraphIdx}-${sentenceIdx}`,
              text: sentence[ApiStructuredTranslatedTextIdx],
            })
          ),
        })
      ),
    };
  },

  rawTextToTextNodes(text) {
    text
      .split("\n")
      .filter((pg) => pg !== "")
      .map((pg, pgIdx) => ({
        type: "paragraph",
        children: [
          {
            text: pg.trim(),
            id: 0,
            uId: `${pgIdx}-0`,
          },
        ],
      }));
  },

  textNodesToApiRequest(editor) {
    return editor.children.map((paragraphs) =>
      paragraphs.children.map((sentences) => sentences.text).join(" ")
    );
  },
  isEmpty(editor) {
    return (
      editor.children.length === 1 &&
      editor.children[0].children.length === 1 &&
      editor.children[0].children[0].text === ""
    );
  },
};

function SlateElement(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <p {...props.attributes}>{props.children}</p>;
}

function HoveringLeaf(props) {
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <span
      onMouseOver={() => props.setHoverId(props.leaf.uId)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props.attributes}
      style={{
        marginRight: "5px",
        backgroundColor:
          props.hoverId && props.leaf.uId === props.hoverId ? "azure" : "white",
      }}
    >
      {props.children}
    </span>
  );
}
function SlateTextInput({
  hoverId,
  setHoverId,
  onCtrlEnter,
  isMainInput,
  onClear,
}) {
  const { t } = useTranslation();

  const renderElement = useCallback((innerProps) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <SlateElement {...innerProps} />;
  }, []);

  const renderLeaf = useCallback(
    (innerProps) => {
      return (
        <HoveringLeaf
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...innerProps}
          hoverId={hoverId}
          setHoverId={setHoverId}
        />
      );
    },
    [setHoverId, hoverId]
  );

  const onKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      onCtrlEnter();
    }
  };
  const placeholderText = !isMainInput
    ? ""
    : t("slate_placeholder", "Enter text..");
  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text">
          <div style={{ height: "100%" }}>
            <Editable
              spellCheck="false"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholderText}
              autoFocus={isMainInput}
              onKeyDown={onKeyDown}
              style={{ height: "100%" }}
            />
          </div>
          {isMainInput && (
            <button
              type="submit"
              className="TranslatorSide-clear"
              onClick={onClear}
            >
              <span>×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SlateEditor({
  editor,
  isMainInput,
  hoverId,
  setHoverId,
  onChange,
  onCtrlEnter,
  onClear,
}) {
  return (
    <Slate
      editor={editor}
      value={SlateEditorFuncs.getInitialTextNodes()}
      onChange={onChange}
    >
      <SlateTextInput
        isMainInput={isMainInput}
        setHoverId={setHoverId}
        onCtrlEnter={onCtrlEnter}
        onClear={onClear}
        hoverId={hoverId}
      />
    </Slate>
  );
}
