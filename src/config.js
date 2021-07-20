const baseURLProd = "velthyding.is";
const baseURLDev = "localhost:3000";
const baseURLBackendProd = "velthyding.is";
const baseURLBackendDev = "localhost:8000";

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const baseURL =
  process.env.NODE_ENV === "development"
    ? `${protocol}://${baseURLDev}`
    : `${protocol}://${baseURLProd}`;
const baseURLBackend =
  process.env.NODE_ENV === "development"
    ? `${protocol}://${baseURLBackendDev}`
    : `${protocol}://${baseURLBackendProd}`;

export const BASE_BACKEND_URL = baseURLBackend;

export const ENGINES = [
  {
    url: `${baseURL}/nn/translate.api`,
    name: "Transformer BT",
    extraData: {
      model: "transformer-bt",
    },
    selected: false,
    textOnly: false,
  },
  {
    url: `${BASE_BACKEND_URL}/translate/`,
    name: "Fairseq DEV",
    extraData: {
      model: "fairseq-dev",
    },
    selected: true,
    textOnly: false,
  },
  {
    url: `${baseURL}/nn/googletranslate.api`,
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
export const SHOW_BRANDING = true;
export const SHOW_LOGIN = true;
