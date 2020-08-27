import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

//LoginPage의 state(이메일, 비번)을 dataToSubmit통해 받음
export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    //response는 server(백앤드)에서 가져온 모든 데이터
    .then(response => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then(response => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios.get("/api/users/auth").then(response => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
