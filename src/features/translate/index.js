import { SlateTranslationEditor } from "components/SlateTranslationEditor";
import { useSelector } from "react-redux";

export default function Translator() {
  const { sourceLang, targetLang } = useSelector((state) => state.translation);
  return (
    <SlateTranslationEditor sourceLang={sourceLang} targetLang={targetLang} />
  );
}
