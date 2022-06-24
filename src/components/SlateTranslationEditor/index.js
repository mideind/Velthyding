import { translate as translateText } from "api/translations";
import { InformationModal } from "components/Error";
import LanguagePicker from "components/LanguagePicker";
import { SlateEditor, SlateEditorFuncs } from "components/SlateEditor";
import mammoth from "mammoth/mammoth.browser";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "semantic-ui-react";
import { createEditor } from "slate";
import { withReact } from "slate-react";
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
                setText(SlateEditorFuncs.rawTextToTextNodes(extractedText));
              })
              .done();
          } else {
            setText(SlateEditorFuncs.rawTextToTextNodes(reader.result));
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

export function SlateTranslationEditor({ sourceLang, targetLang }) {
  const { t } = useTranslation();
  const [hoverId, setHoverId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [srcEditor] = useState(() => withReact(createEditor()));
  const [transEditor] = useState(() => withReact(createEditor()));
  const { getRootProps, getInputProps, isDragActive } = useOnDrop((rawText) => {
    SlateEditorFuncs.resetEditor(srcEditor);
    const textNodes = SlateEditorFuncs.rawTextToTextNodes(rawText);
    SlateEditorFuncs.AppendTextNodes(srcEditor, textNodes);
  });

  const clearText = () => {
    // resetSelection();
    setHoverId(-1);
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
    <Button
      className="TranslateBox-submit TranslateBox-upload"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getRootProps()}
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
    </Button>
  );
  const handleChange = (newValue) => {
    return console.log(newValue);
  };
  // the value provided to the editor is only the initial value! It's only read once.
  // OnChange is called every time the editor is updated, even set position.
  // When we interract with slate's nodes, we need to update the selection value.
  return (
    <div className="Translate">
      {translateButton}
      <div className="Translator">
        <LanguagePicker />
        <div className="Translator-containers">
          <SlateEditor
            editor={srcEditor}
            isMainInput
            hoverId={hoverId}
            onClear={clearText}
            setHoverId={setHoverId}
            onCtrlEnter={translate}
            onChange={handleChange}
          />
          <SlateEditor
            editor={transEditor}
            isMainInput={false}
            hoverId={hoverId}
            onClear={clearText}
            setHoverId={setHoverId}
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
