import {
  storeTranslationCorrection,
  translate as translateText,
} from "api/translations";
import "App.css";
import Translator from "components/Translator";
import mammoth from "mammoth";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "semantic-ui-react";
import { setTranslation } from "./translateSlice";

const parseForSlate = (text) =>
  text
    .split("\n")
    .filter((pg) => pg !== "")
    .map((pg) => ({
      type: "paragraph",
      children: pg
        .split(".")
        .filter((sentence) => sentence !== "")
        .map((sentence) => ({
          text: sentence.trim(),
          translation: "",
        })),
    }));

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
                setText(parseForSlate(extractedText));
              })
              .done();
          } else {
            setText(parseForSlate(reader.result));
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

const updateParagraph = (pg, pgId) =>
  pg.map((s, i) => ({
    id: i,
    uId: `${pgId}-${i}`,
    text: s[0],
    translation: s[1],
  }));

const updateText = (translationObject) => {
  const translations = translationObject.structuredText;
  return translations.map((v, i) => ({
    type: "paragraph",
    children: updateParagraph(v, i),
  }));
};

function Translate({ modelName }) {
  const { t } = useTranslation();
  const [hoverId, setHoverId] = useState(-1);
  const [translationId, setTranslationId] = useState(null);
  const [text, setText] = useState([
    {
      type: "paragraph",
      children: [
        {
          id: 0,
          text: "",
          translation: "",
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const { sourceLang, targetLang } = useSelector((state) => state.translation);
  const dispatch = useDispatch();
  const { getRootProps, getInputProps, isDragActive } = useOnDrop(setText);
  function isNoOp(inputText) {
    return (
      inputText.length === 1 &&
      inputText[0].children.length === 1 &&
      inputText[0].children[0].text === ""
    );
  }

  const translate = async () => {
    if (isNoOp(text)) {
      return;
    }
    setLoading(true);

    const tran = await translateText(modelName, text, sourceLang, targetLang);

    const newText = updateText(tran);
    setText(newText);
    dispatch(
      setTranslation({
        text: tran.text,
        structuredText: tran.structuredText,
      })
    );
    setLoading(false);
  };

  const revise = async () => {
    if (isNoOp(text)) {
      return;
    }
    setLoading(true);

    storeTranslationCorrection(
      translationId,
      `${sourceLang}-${targetLang}`,
      modelName,
      text.map((pg) => pg.children.map((ch) => ch.text).join("")).join("\n\n"),
      text
        .map((pg) => pg.children.map((ch) => ch.translation).join(""))
        .join("\n\n")
    )
      .then((resp) => {
        if (resp.data.id) {
          setTranslationId(resp.data.id);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      text.length === 1 &&
      text[0].children.length === 1 &&
      text[0].children[0].text === "" &&
      text[0].children[0].translation === ""
    ) {
      setHoverId("");
      setTranslationId(null);
    }
  }, [text, dispatch, hoverId]);

  const translateButton = (
    <Button primary className="TranslateBox-submit" onClick={translate}>
      {loading ? (
        <ClipLoader size={10} color="#FFF" />
      ) : (
        <span> {t("translate_button", "Translate")} </span>
      )}
    </Button>
  );

  const reviseButton = (
    <Button color="green" className="TranslateBox-submit" onClick={revise}>
      {loading ? (
        <ClipLoader size={10} color="#FFF" />
      ) : (
        <span> {t("revise_button", "Revise")} </span>
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
      <Translator
        sourceText={text}
        setText={setText}
        hoverId={hoverId}
        setHoverId={setHoverId}
      />
      <div>
        <div className="Translate-footer">
          {uploadButton}
          {translateButton}
          {translationId && reviseButton}
        </div>
      </div>
    </div>
  );
}

export default Translate;
