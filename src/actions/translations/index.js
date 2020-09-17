import { PREFIX_TRANSLATION_URL } from 'config.js';
import { decodeHTML } from '../../utils/text.js';

// Simplified wrapper to ignore structure
export async function updateSentenceTranslation(text, prefix, source, target) {
  const url = PREFIX_TRANSLATION_URL;

  const data = {
    contents: [text],
    prefixes: [prefix],
    sourceLanguageCode: source,
    targetLanguageCode: target,
  };
  const param = {
    method: 'POST',
    crossDomain: true,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; utf-8',
    },
  };
  param.body = JSON.stringify(data);
  const response = await fetch(url, param).catch((e) => console.log(e));
  if (response !== undefined) {
    try {
      const transl = await response.json();
      return transl.translations[0].translatedText;
    } catch (err) {
      return ['Error'];
    }
  }
}


export async function translate(engine, text, source, target, prefix) {
  const data = {
    ...engine.extraData,
    model: engine.extraData !== undefined && engine.extraData.model !== undefined ? engine.extraData.model : `${source}-${target}`,
    contents: text.map((pg) => pg.children.map((ch) => ch.text).join('')),
    sourceLanguageCode: source,
    targetLanguageCode: target,
  };

  // prefix is a tuple []

  const { url } = engine;
  const param = {
    method: 'POST',
    crossDomain: true,
    mode: 'cors',
    ...engine.extraParam,
    headers: {
      'Content-Type': 'application/json; utf-8',
      ...engine.extraHeader,
    },
  };
  param.body = JSON.stringify(data);

  if (source === target) {
    return text;
  }

  let transl;
  const response = await fetch(url, param).catch((e) => console.log(e));
  if (response !== undefined) {
    try {
      transl = await response.json();
      const returnTrans = transl.translations.map((trans) => decodeHTML(trans.translatedText));
      const structuredTrans = transl.translations.filter((trans) => trans.translatedTextStructured).map((trans) => trans.translatedTextStructured);
      return { ...transl, translations: returnTrans, structuredTrans };
    } catch (err) {
      return ['Error'];
    }
  } else {
    return ['Error'];
  }
}

export async function translateMany(engines, text, source, target, transl, prefix) {
  const translations = await engines.map((engine) => translate(engine, text, source, target, transl, prefix));
  return Promise.all(translations).then((ts) => ts.map((p, i) => ({
    text: p.translations, structuredText: p.structuredTrans, engine: engines[i],
  })));
}
