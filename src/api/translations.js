import { apiClient } from "api";

export async function storeTranslation(
  translationId,
  languagePair,
  model,
  sourceText,
  targetText
) {
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

  return ac.post(`api/translations/usertranslations/`, data);
}

export async function storeTranslationCorrection(
  translationId,
  languagePair,
  model,
  sourceText,
  targetText
) {
  const data = {
    languagePair,
    model,
    originalText: sourceText,
    correctedText: targetText,
  };
  if (translationId !== null) {
    data.original = translationId;
  }
  const ac = apiClient();

  return ac.post("translate/corrected", data);
}

export async function getTranslations() {
  const ac = apiClient();
  return ac.get("api/translations/usertranslations/", {});
}
