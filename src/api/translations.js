import { apiClient } from "api";

export async function storeTranslation(
  translationId,
  language_pair,
  model,
  source_text,
  target_text
) {
  const translationURI =
    translationId === null ? "usertranslations" : "corrections";
  const data = {
    language_pair,
    model,
    source_text,
    target_text,
  };
  if (translationId !== null) {
    data.original = translationId;
  }

  return new Promise((resolve, reject) => {
    const ac = apiClient();
    return ac
      .post(`api/translations/${translationURI}/`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function getTranslations() {
  return new Promise((resolve, reject) => {
    const ac = apiClient();
    return ac
      .get("api/translations/usertranslations/", {})
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
