const baseURLProd = 'velthyding.mideind.is';
const baseURLDev = 'localhost:5050';

const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
const baseURL = process.env.NODE_ENV === 'development' ? baseURLDev : baseURLProd;

export const ENGINES = [
  {
    url: `${protocol}://${baseURL}/nn/translate.api`,
    name: 'Transformer',
    extraData: {
      model: 'transformer',
    },
    selected: false,
  },
  {
    url: `${protocol}://${baseURL}/nn/translate.api`,
    name: 'Transformer BT',
    extraData: {
      model: 'transformer-bt',
    },
    selected: true,
  },
  {
    url: `${protocol}://${baseURL}/nn/translate.api`,
    name: 'Bi-LSTM',
    extraData: {
      model: 'bilstm',
    },
    selected: false,
  },
  {
    url: `${protocol}://nlp.cs.ru.is/moses/translateText`,
    name: 'Moses',
    extraData: {
      model: 'moses',
    },
    selected: false,
  },
  {
    url: `${protocol}://${baseURL}/nn/googletranslate.api`,
    name: 'Google',
    selected: false,
  },
];

//
// Configuration parameters for branded setup or usage of backend for logging.
//
export const PROD_BACKEND_URL = 'https://velthyding.mideind.is:8000/';
export const DEV_BACKEND_URL = 'http://localhost:8000/';
export const BASE_BACKEND_URL = process.env.NODE_ENV === 'development' ? DEV_BACKEND_URL : PROD_BACKEND_URL;
export const SHOW_BRANDING = true;
export const SHOW_LOGIN = false;
