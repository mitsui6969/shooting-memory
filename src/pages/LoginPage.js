import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button_white/Button_white";
import "../styles/LoginPage.css";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase/firebase-app";

const LoginPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState("");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((error) => {
      setErrorMessage("ログインに失敗しました<br />もう一度お試しください");
      console.error("ログインエラー:", error);
    });
  };

  useEffect(() => {
    if (user) {
      const userId = auth.currentUser?.uid;
      navigate("/", { state: { userId } });
    }
  }, [user, navigate]);

  const handleGuestStart = () => {
    const generatedId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    navigate("/", { state: { guestId: generatedId } });
  };

  return (
    <div className="loginpage">
      <div className="title">思い出射撃</div>
      <div className="login">
        {errorMessage && (
          <div
            className="error-message"
            dangerouslySetInnerHTML={{ __html: errorMessage }} // <br />タグをHTMLとして処理
          />
        )}
        {user ? (
          <Button onClick={() => auth.signOut()}>
            <p>サインアウト</p>
          </Button>
        ) : (
          <Button onClick={signInWithGoogle}>
            <p>ログイン</p>
          </Button>
        )}
        <Button onClick={handleGuestStart}>ログインせずに始める</Button>
      </div>
    </div>
  );
};

export default LoginPage;
