import _ from "lodash";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Popup } from "semantic-ui-react";
import { Editor, Transforms } from "slate";
import { Editable, ReactEditor, Slate, useSlate } from "slate-react";

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
          text: `${sentence[ApiStructuredSourceTextIdx]} `, // We add a space at the end of each sentence
          dummy: [pIdx, sIdx], // Slate will merge children which have the same props on text values - we prevent this by adding a dummy value
        })),
      })),
      translatedText: translationResponse.translations.map(
        (paragraph, pIdx) => ({
          type: "paragraph",
          children: paragraph.translatedTextStructured.map(
            (sentence, sIdx) => ({
              text: `${sentence[ApiStructuredTranslatedTextIdx]} `, // We add a space at the end of each sentence
              dummy: [pIdx, sIdx], // Slate will merge children which have the same props on text values - we prevent this by adding a dummy value
            })
          ),
        })
      ),
    };
  },

  rawTextToTextNodes(text) {
    return text
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
      paragraphs.children.map((sentences) => sentences.text.trim()).join(" ")
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
        backgroundColor: props.leaf.hovering ? "#e6f3ff" : "transparent",
      }}
    >
      {props.children}
    </span>
  );
}

function getClipboardDataTransfer() {
  return {
    getData: (_key) => {},
    setData: (key, value) => {
      if (key === "text/plain") {
        if (!navigator.clipboard) {
          console.log("Clipboard not supported");
        } else {
          console.log("setData", key, value);
          navigator.clipboard.writeText(value).catch((err) => {
            console.error("Could not copy text: ", err);
          });
        }
      }
    },
  };
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
  const editor = useSlate();
  const copyText = useCallback(() => {
    console.log("copyText");
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    });
    ReactEditor.setFragmentData(editor, getClipboardDataTransfer());
    // const data = [
    //   new ClipboardItem({
    //     "text/plain": new Blob(["Text data"], { type: "text/plain" }),
    //   }),
    // ];
    // navigator.clipboard.write(data).then(
    //   function () {
    //     console.log("Copied to clipboard successfully!");
    //   },
    //   function () {
    //     console.error("Unable to write to clipboard. :-(");
    //   }
    // );
  }, [editor]);
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
      <div
        className="TranslatorSide-container"
        style={{ backgroundColor: isMainInput ? "white" : "rgb(231,231,231)" }}
      >
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
              style={{
                height: "100%",
              }}
            />
          </div>
          {isMainInput && (
            <button
              type="button"
              className="TranslatorSide-clear"
              onClick={onClear}
            >
              ×
            </button>
          )}
          {!isMainInput && (
            <Popup
              trigger={
                <button
                  className="TranslatorSide-copy"
                  type="button"
                  onClick={copyText}
                >
                  <Icon name="copy outline" />
                </button>
              }
              on="click"
              content="Copied!"
              size="tiny"
              closeOnTriggerMouseLeave
              openOnTriggerClick
            />
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
