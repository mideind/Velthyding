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

  return ac.post(`core/api/translations/usertranslations/`, data);
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
  return ac.get("core/api/translations/usertranslations/", {});
}

export async function translate(text, sourceLang, targetLang) {
  if (sourceLang === targetLang) {
    return text;
  }
  const data = {
    contents: text,
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
  };

  const ac = apiClient();
  const response = await ac.post("translate/", data);
  return response.data;
  // data = {
  //   "translations": [
  //     {
  //       "translatedText": "feafeafdsa",
  //       "translatedTextStructured": [
  //         [
  //           "asdfaefaef",
  //           "feafeafdsa"
  //         ]
  //       ]
  //     }
  //   ],
  //   "sourceLanguageCode": "en",
  //   "targetLanguageCode": "is",
  //   "model": "mbart25-cont"
  // }
}
