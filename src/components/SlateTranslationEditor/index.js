import { translate as translateText } from "api/translations";
import { InformationModal } from "components/Error";
import LanguagePicker from "components/LanguagePicker";
import { SlateEditor, SlateEditorFuncs } from "components/SlateEditor";
import mammoth from "mammoth/mammoth.browser";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "semantic-ui-react";
import { createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { ReactEditor, withReact } from "slate-react";
import "./index.css";

function useOnDrop(setText) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        const isDocx = file.path.split(".")[1] === "docx";
        reader.onload = () => {
          if (isDocx) {
            mammoth
              .extractRawText({ arrayBuffer: reader.result })
              .then((result) => {
                const extractedText = result.value;
                setText(extractedText);
              })
              .done();
          } else {
            setText(reader.result);
          }
        };
        if (isDocx) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      });
    },
    [setText]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return { getRootProps, getInputProps, isDragActive };
}

function withCleanPaste(editor) {
  const { insertData } = editor;
  // eslint-disable-next-line no-param-reassign
  editor.insertData = (data) => {
    const plain = data.getData("text/plain");

    if (plain) {
      const newTextNodes = SlateEditorFuncs.rawTextToTextNodes(plain);
      SlateEditorFuncs.AppendTextNodes(editor, newTextNodes);
      return;
    }

    insertData(data);
  };

  return editor;
}

export function SlateTranslationEditor({ sourceLang, targetLang }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [srcEditor] = useState(() =>
    withCleanPaste(withReact(withHistory(createEditor())))
  );
  const [transEditor] = useState(() =>
    withCleanPaste(withReact(withHistory(createEditor())))
  );
  const { getRootProps, getInputProps, isDragActive } = useOnDrop((rawText) => {
    SlateEditorFuncs.resetEditor(srcEditor);
    const textNodes = SlateEditorFuncs.rawTextToTextNodes(rawText);
    SlateEditorFuncs.AppendTextNodes(srcEditor, textNodes);
  });
  const onHover = (editor, domElement, propsToSet) => {
    const path = ReactEditor.findPath(
      editor,
      ReactEditor.toSlateNode(editor, domElement)
    );
    Transforms.setNodes(editor, propsToSet, { at: path });
    // Get the other editor
    const otherEditor = srcEditor === editor ? transEditor : srcEditor;
    try {
      // And try to do the same on the other editor.
      // If it fails, then the other side is probably empty.
      Transforms.setNodes(otherEditor, propsToSet, { at: path });
    } catch (e) {
      // ignore
    }
  };

  const clearText = () => {
    SlateEditorFuncs.resetEditor(srcEditor);
    SlateEditorFuncs.resetEditor(transEditor);
  };

  const resetError = useCallback(() => {
    setErrorMsg("");
  }, [setErrorMsg]);

  const translate = async () => {
    if (SlateEditorFuncs.isEmpty(srcEditor)) {
      return;
    }
    setLoading(true);

    try {
      const sourceTextReq = SlateEditorFuncs.textNodesToApiRequest(srcEditor);
      const translatedTextResponse = await translateText(
        sourceTextReq,
        sourceLang,
        targetLang
      );
      const newTextNodes = SlateEditorFuncs.apiResponseToTextNodes(
        translatedTextResponse
      );
      SlateEditorFuncs.resetEditor(srcEditor);
      SlateEditorFuncs.resetEditor(transEditor);
      SlateEditorFuncs.AppendTextNodes(
        transEditor,
        newTextNodes.translatedText
      );
      SlateEditorFuncs.AppendTextNodes(srcEditor, newTextNodes.sourceText);
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };
  // Set the selection on the srcEditor if it is focused and empty
  // This is so that the user can start typing right away
  useEffect(() => {
    if (
      ReactEditor.isFocused(srcEditor) &&
      SlateEditorFuncs.isEmpty(srcEditor)
    ) {
      Transforms.select(srcEditor, [0, 0]);
    }
  }, [srcEditor]);

  const translateButton = (
    <Button primary className="TranslateBox-submit" onClick={translate}>
      {loading ? (
        <ClipLoader size={10} color="#FFF" />
      ) : (
        <span> {t("translate_button", "Translate")} </span>
      )}
    </Button>
  );

  const uploadButton = (
    <button
      type="button"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getRootProps({
        className: "ui button TranslateBox-upload",
      })}
    >
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps()}
      />
      {isDragActive ? (
        <span>{t("drop_button", "Drop here")}</span>
      ) : (
        <span>{t("upload_button", "Upload")}</span>
      )}
    </button>
  );
  const handleChange = (_newValue) => {
    // return console.log(_newValue);
  };
  // the value provided to the editor is only the initial value! It's only read once.
  // OnChange is called every time the editor is updated, even set position.
  return (
    <div className="Translate">
      {translateButton}
      <div className="Translator">
        <LanguagePicker />
        <div className="Translator-containers">
          <SlateEditor
            editor={srcEditor}
            initialValue={SlateEditorFuncs.getInitialTextNodes()}
            isMainInput
            onClear={clearText}
            onHover={onHover}
            onCtrlEnter={translate}
            onChange={handleChange}
          />
          <SlateEditor
            editor={transEditor}
            initialValue={SlateEditorFuncs.getInitialTextNodes()}
            isMainInput={false}
            onClear={clearText}
            onHover={onHover}
            onCtrlEnter={translate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <div className="Translate-footer">
          {uploadButton}
          {translateButton}
        </div>
      </div>
      {errorMsg !== "" && (
        <InformationModal
          header="Unable to translate"
          message={errorMsg}
          onDismiss={resetError}
        />
      )}
    </div>
  );
}

export default SlateEditorFuncs;
