import axios from "axios";
import BASE_BACKEND_URL from "config";
import { Cookies } from "react-cookie";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // 30sec default timeout

const cookies = new Cookies();

export const apiClient = (BASE_URL = BASE_BACKEND_URL) => {
  // Use this if not running on same domain.
  // const csrfCookie = cookies.get(axios.defaults.xsrfCookieName, { path: "/" });

  const params = {
    baseURL: `${BASE_URL}`,
    headers: {
      Authorization: "no",
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: true,
  };
  const csrfToken = cookies.get(axios.defaults.xsrfCookieName);
  if (csrfToken != null) {
    params.headers["X-CSRFToken"] = csrfToken;
  }

  const ac = axios.create(params);

  ac.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response !== undefined && error.response.status === 401) {
        window.location.href = "/";
      }
      // We log the error here.
      console.log(error);
      return Promise.reject(error);
    }
  );

  return ac;
};

export async function checkUser() {
  const ac = apiClient();
  const response = await ac.post("core/check/", {});
  return response.data.email;
}

export async function resetCSRFCookie() {
  const ac = apiClient();
  const response = await ac.get("core/csrf/");
  return response.status;
}

export async function loginUser(username, password) {
  const ac = apiClient();
  return ac.post("core/login/", {
    username,
    password,
  });
}

export async function registerUser(email, password) {
  const ac = apiClient();
  return ac.post("core/register/", {
    email,
    password,
  });
}

export async function logoutUser() {
  const ac = apiClient();
  const response = await ac.post("core/logout/");
  return response;
}
