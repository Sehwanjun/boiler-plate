import React, { useState } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = event => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = event => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = event => {
    // 새로고침 방지
    event.preventDefault();
    // 상단의 함수에서 email, password state 값 생성했음
    let body = {
      email: Email,
      password: Password,
    };
    //입력 > 리덕스 > backend서버로
    dispatch(loginUser(body)).then(response => {
      //만약 로그인 성공시(true)에 "/"사이트 주소로 들어간다
      if (response.payload.loginSuccess) {
        props.history.push("/");
      } else {
        alert("Error˝");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
