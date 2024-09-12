import React, { } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import Button from "../components/Button_white/Button_white";
import "../styles/LoginPage.css"; // CSSファイルをインポート


const LoginPage = () => {

  const navigate = useNavigate(); // navigate関数を定義

  return (
    <div className="loginpage">
      <div className="title">思い出射撃</div>
				<div className="login">
          <Button onClick={() => navigate("/toppage")}>ログイン</Button>
        </div>
				<div className="no-login">
          <Button onClick={() => navigate("/toppage")}>ログインせずに始める</Button>
        </div>
    </div>
  );
};

export default LoginPage;
