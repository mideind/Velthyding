import { translate as translateText } from "api/translations";
import { InformationModal } from "components/Error";
import LanguagePicker from "components/LanguagePicker";
import SlateTextInput from "components/SlateTextInput";
import mammoth from "mammoth/mammoth.browser";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "semantic-ui-react";
import { createEditor } from "slate";
import { Slate, withReact } from "slate-react";
import "./index.css";

function SlateTranslateBox({
  hoverId,
  setHoverId,
  isTranslation,
  translateFunc,
  clearText,
}) {
  return (
    <div className="TranslatorSide">
      <div className="TranslatorSide-container">
        <div className="TranslatorSide-text">
          <SlateTextInput
            isTranslation={isTranslation}
            hoverId={hoverId}
            setHoverId={setHoverId}
            translateFunc={translateFunc}
          />
          {!isTranslation && (
            <button
              type="submit"
              className="TranslatorSide-clear"
              onClick={clearText}
            >
              <span>×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function rawTextToSlateDataStructure(text) {
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
}

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
                setText(rawTextToSlateDataStructure(extractedText));
              })
              .done();
          } else {
            setText(rawTextToSlateDataStructure(reader.result));
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

const initialEditorState = [
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

function slateDataStructureToApi(textToTranslate) {
  return textToTranslate.map((paragraphs) =>
    paragraphs.children.map((sentences) => sentences.text).join(" ")
  );
}
function apiToSlateDataStructure(translationResponse) {
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
}

function SlateTranslator() {
  const { t } = useTranslation();
  const [hoverId, setHoverId] = useState(-1);
  const [sourceText, setSourceText] = useState(initialEditorState);
  const [translatedText, setTranslatedText] = useState(initialEditorState);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { sourceLang, targetLang } = useSelector((state) => state.translation);
  const [srcEditor] = useState(() => withReact(createEditor()));
  const [transEditor] = useState(() => withReact(createEditor()));
  const { getRootProps, getInputProps, isDragActive } =
    useOnDrop(setSourceText);

  function isNoOp(inputText) {
    return (
      inputText.length === 1 &&
      inputText[0].children.length === 1 &&
      inputText[0].children[0].text === ""
    );
  }

  const resetSelection = () => {
    const point = { path: [0, 0], offset: 0 };
    srcEditor.selection = { anchor: point, focus: point };
    transEditor.selection = { anchor: point, focus: point };
  };

  const clearText = () => {
    resetSelection();
    setSourceText(initialEditorState);
    setTranslatedText(initialEditorState);
    setHoverId(-1);
  };

  const resetError = useCallback(() => {
    setErrorMsg("");
  }, [setErrorMsg]);

  const translate = async () => {
    if (isNoOp(sourceText)) {
      return;
    }
    setLoading(true);

    try {
      const translTextReq = slateDataStructureToApi(sourceText);
      console.log(translTextReq);
      const tranResponse = await translateText(
        translTextReq,
        sourceLang,
        targetLang
      );
      const newText = apiToSlateDataStructure(tranResponse);
      console.log(newText);
      //   resetSelection();
      setSourceText(newText.sourceText);
      setTranslatedText(newText.translatedText);
      // We also need to fix the selection
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isNoOp(sourceText) && isNoOp(translatedText)) {
      setHoverId(-1);
    }
  }, [sourceText, translatedText]);

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

  return (
    <div className="Translate">
      {translateButton}
      <div className="Translator">
        <LanguagePicker />
        <div className="Translator-containers">
          <Slate
            editor={srcEditor}
            value={sourceText}
            onChange={(value) => setSourceText(value)}
          >
            <SlateTranslateBox
              isTranslation={false}
              setHoverId={setHoverId}
              hoverId={hoverId}
              clearText={clearText}
              translateFunc={translate}
            />
          </Slate>
          <Slate
            editor={transEditor}
            value={translatedText}
            onChange={(value) => setTranslatedText(value)}
          >
            <SlateTranslateBox
              isTranslation
              setHoverId={setHoverId}
              hoverId={hoverId}
              clearText={clearText}
              translateFunc={translate}
            />
          </Slate>
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

export default SlateTranslator;
