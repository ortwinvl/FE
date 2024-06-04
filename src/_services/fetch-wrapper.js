import { useAuthStore } from "../stores/sec-auth.store";
import axios from "axios";

let download = false;
const BE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
  login: request("LOGIN"),
  download: request("DOWNLOAD"),
};

function request(method) {
  return (url, body, type) => {
    const fullurl = `${BE_URL}${url}`;
    const requestOptions = {
      baseURL: BE_URL,
      url: url,
      method: method,
      headers: authHeader(url),
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status == 400;
      },
    };

    switch (method) {
      case "LOGIN":
        axios.defaults.withCredentials = true;
        return axios
          .post(fullurl, body, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(handleResponse)
          .catch(async function (error) {
            console.log("fetch-wrapper: error in request response");
            console.log(error);
            handleResponse(error.response);
          });

      case "DOWNLOAD": {
        requestOptions.method = "POST";
        download = true;
        requestOptions.responseType = "blob"; // had to add this one here
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.data = JSON.stringify(body);
        return axios
          .request(requestOptions)
          .then(handleResponse)
          .catch(async function (error) {
            console.log("fetch-wrapper: error in request response");
            console.log(error);
            handleResponse(error.response);
          });
      }

      default: {
        const requestOptions = {
          baseURL: BE_URL,
          url: url,
          method: method,
          headers: authHeader(url),
          validateStatus: function (status) {
            return (status >= 200 && status < 300) || status == 400;
          },
        };

        if (body) {
          if (type == "multipart") {
            requestOptions.headers["Content-Type"] = "multipart/form-data";
            requestOptions.data = body;
          } else {
            requestOptions.headers["Content-Type"] = "application/json";
            requestOptions.data = JSON.stringify(body);
          }
        }

        axios.defaults.withCredentials = true;
        return axios
          .request(requestOptions)
          .then(handleResponse)
          .catch(async function (error) {
            console.log("fetch-wrapper: error in request response");
            console.log(error);
            handleResponse(error.response);
          });
      }
    }
  };
}

// helper functions
function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.user;
  const isApiUrl = true; //url.startsWith(import.meta.env.VITE_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { "x-access-token": authStore.user.accessToken };
  } else {
    return {};
  }
}

async function handleResponse(response) {
  if (download) {
    return response.data;
  }
  const isJson = response.headers
    ?.get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.data : null;
  // check for error response
  if (data && data.result == 1) {
    return data;
  } else {
    const { user, logout } = useAuthStore();
    // if ([401, 403].includes(response.status) && user) {
    //   // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //   logout();
    //   return;
    // }
    // get error message from body or default to response status
    const error = (data && data.error) || response.status;
    return Promise.reject();
  }
}
