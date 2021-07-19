import axios from "axios";
import { BASE_BACKEND_URL } from "config";
import { login, logout } from "features/login/loginSlice";
import { Cookies } from "react-cookie";
import { store } from "store";

const CSRF = "csrf/";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

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
    withCredentials: true, // needed to store response csrf
  };

  // if (csrfCookie != null) {
  //  params.headers['X-CSRFToken'] = csrfCookie;
  // }

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

  if (response.data.email !== null) {
    store.dispatch(login(response.data.email));
  }
}

export const setCsrf = (csrf) => {
  cookies.remove(axios.defaults.xsrfCookieName, { path: "/" });
  cookies.set(axios.defaults.xsrfCookieName, csrf, { path: "/" });
};

export const checkCookie = (force = false) => {
  const csrfCookie = cookies.get(axios.defaults.xsrfCookieName);
  if (force || csrfCookie == null) {
    const ac = apiClient();
    ac.get(`core/${CSRF}`)
      .then((response) => {
        setCsrf(response.data);
        checkUser();
      })
      .catch((error) => console.log(error));
  }
};

export const checkUserAndCookie = () => {
  checkUser().catch(() => {
    checkCookie(true);
  });
};

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
  store.dispatch(logout());
  cookies.remove(axios.defaults.xsrfCookieName, { path: "/" });
  return response;
}
