import axios from "axios";
import Cookies from "js-cookie";

export const GTSApiClient = axios.create({
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
    Authorization: "Token " + localStorage.getItem("authToken"),
  },
});

export const SpotifyApiClient = axios.create({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
});
