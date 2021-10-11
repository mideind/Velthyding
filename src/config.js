const baseURLBackendProd = "velthyding.is";
const baseURLBackendDev = "localhost:8000";

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const baseURLBackend =
  process.env.NODE_ENV === "development"
    ? `${protocol}://${baseURLBackendDev}`
    : `${protocol}://${baseURLBackendProd}`;

export const BASE_BACKEND_URL = baseURLBackend;

//
// Configuration parameters for branded setup or usage of backend for logging.
//
export const SHOW_BRANDING = true;
export const SHOW_LOGIN = true;
