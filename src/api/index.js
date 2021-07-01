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

export const apiClient = (BASE_URL = "") => {
  // Use this if not running on same domain.
  // const csrfCookie = cookies.get(axios.defaults.xsrfCookieName, { path: "/" });

  const url2use = BASE_URL !== "" ? BASE_URL : BASE_BACKEND_URL;

  const params = {
    baseURL: `${url2use}`,
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
      return Promise.reject(error);
    }
  );

  return ac;
};

export function checkUser() {
  return new Promise((resolve, reject) => {
    const ac = apiClient();
    return ac
      .post("check/", {})
      .then((response) => {
        if (response.data.email !== null) {
          store.dispatch(login(response.data.email));
        }
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        checkCookie(true);
      });
  });
}

export const setCsrf = (csrf) => {
  cookies.remove(axios.defaults.xsrfCookieName, { path: "/" });
  cookies.set(axios.defaults.xsrfCookieName, csrf, { path: "/" });
};

export const checkCookie = (force = false) => {
  const csrfCookie = cookies.get(axios.defaults.xsrfCookieName);
  if (force || csrfCookie == null) {
    const ac = apiClient();
    ac.get(CSRF)
      .then((response) => {
        setCsrf(response.data);
        checkUser();
      })
      .catch((error) => console.log(error));
  }
};

export function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    const ac = apiClient();

    return ac
      .post("login/", {
        username,
        password,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function registerUser(email, password) {
  return new Promise((resolve, reject) => {
    const ac = apiClient();

    return ac
      .post("register/", {
        email,
        password,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function logoutUser() {
  return new Promise((resolve, reject) => {
    const ac = apiClient();
    return ac
      .post("logout/")
      .then((response) => {
        store.dispatch(logout());
        cookies.remove(axios.defaults.xsrfCookieName, { path: "/" });

        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
