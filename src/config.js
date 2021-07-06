const baseURLProd = "velthyding.is";
const baseURLDev = "velthyding.is"; // 'localhost:5050';

const protocol = process.env.NODE_ENV === "development" ? "https" : "https";
const baseURL =
  process.env.NODE_ENV === "development" ? baseURLDev : baseURLProd;

export const ENGINES = [
  {
    url: `${protocol}://${baseURL}/nn/translate.api`,
    name: "Transformer BT",
    extraData: {
      model: "transformer-bt",
    },
    selected: false,
    textOnly: false,
  },
  {
    url: "/translate/",
    name: "Fairseq DEV",
    extraData: {
      model: "fairseq-dev",
    },
    selected: true,
    textOnly: false,
  },
  {
    url: `${protocol}://${baseURL}/nn/googletranslate.api`,
    name: "Google",
    selected: false,
    textOnly: true,
  },
];

// Prefix translation
export const PREFIX_TRANSLATION_URL = ENGINES[1].url;

//
// Configuration parameters for branded setup or usage of backend for logging.
//
export const PROD_BACKEND_URL = "/core/";
export const DEV_BACKEND_URL = "http://localhost:8000/core/";
export const BASE_BACKEND_URL =
  process.env.NODE_ENV === "development" ? DEV_BACKEND_URL : PROD_BACKEND_URL;
export const SHOW_BRANDING = true;
export const SHOW_LOGIN = true;
