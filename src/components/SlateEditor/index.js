import _ from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Transforms } from "slate";
import { Editable, Slate, useSlate } from "slate-react";

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
            text: "",
            hovering: false,
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
    Transforms.insertNodes(editor, this.getInitialTextNodes(), {
      at: [0],
    });
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
      sourceText: translationResponse.translations.map((paragraph, pIdx) => ({
        type: "paragraph",
        children: paragraph.translatedTextStructured.map((sentence, sIdx) => ({
          text: sentence[ApiStructuredSourceTextIdx],
          dummy: [pIdx, sIdx], // Slate will merge children which have the same props on text values - we prevent this by adding a dummy value
        })),
      })),
      translatedText: translationResponse.translations.map(
        (paragraph, pIdx) => ({
          type: "paragraph",
          children: paragraph.translatedTextStructured.map(
            (sentence, sIdx) => ({
              text: sentence[ApiStructuredTranslatedTextIdx],
              dummy: [pIdx, sIdx], // Slate will merge children which have the same props on text values - we prevent this by adding a dummy value
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
      .map((pg) => ({
        type: "paragraph",
        children: [
          {
            text: pg.trim(),
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
  const currentEditor = useSlate();
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <span
      onMouseEnter={(event) => {
        props.onHover(currentEditor, event.target, { hovering: true });
      }}
      onMouseLeave={(event) => {
        props.onHover(currentEditor, event.target, { hovering: false });
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props.attributes}
      style={{
        marginRight: "5px",
        backgroundColor: props.leaf.hovering ? "#e6f3ff" : "white",
      }}
    >
      {props.children}
    </span>
  );
}
function SlateTextInput({ onHover, onCtrlEnter, isMainInput, onClear }) {
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
          onHover={onHover}
        />
      );
    },
    [onHover]
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
              readOnly={!isMainInput}
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
  initialValue,
  isMainInput,
  onHover,
  onChange,
  onCtrlEnter,
  onClear,
}) {
  return (
    <Slate editor={editor} value={initialValue} onChange={onChange}>
      <SlateTextInput
        isMainInput={isMainInput}
        onHover={onHover}
        onCtrlEnter={onCtrlEnter}
        onClear={onClear}
      />
    </Slate>
  );
}
