import { apiClient } from "api";

export async function storeTranslation(
  translationId,
  languagePair,
  model,
  sourceText,
  targetText
) {
  const translationURI =
    translationId === null ? "usertranslations" : "corrections";
  const data = {
    language_pair: languagePair,
    model,
    source_text: sourceText,
    target_text: targetText,
  };
  if (translationId !== null) {
    data.original = translationId;
  }
  const ac = apiClient();

  return ac.post(`api/translations/${translationURI}/`, data);
}

export async function getTranslations() {
  const ac = apiClient();
  return ac.get("api/translations/usertranslations/", {});
}
