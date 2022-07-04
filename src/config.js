const baseURLBackendProd = "velthyding.is";
const baseURLBackendDev = "localhost:8000";

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const BASE_BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? `${protocol}://${baseURLBackendDev}`
    : `${protocol}://${baseURLBackendProd}`;
export default BASE_BACKEND_URL;
