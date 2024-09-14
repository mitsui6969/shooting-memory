import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import Button from "../components/Button_white/Button_white";
import "../styles/LoginPage.css"; // CSSファイルをインポート
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase/firebase-app"; // Firebase関連のインポート

const LoginPage = () => {
  const navigate = useNavigate(); // navigate関数を定義
  const [user] = useAuthState(auth); // 認証状態を取得
  const [error, setError] = useState(""); // エラーメッセージの状態管理

  // Googleサインイン関数
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider); // 成功したらそのまま続行
    } catch (err) {
      console.error("ログイン失敗:", err.message);
      setError("ログインに失敗しました。もう一度お試しください。"); // エラーメッセージを設定
    }
  };

  // 仮IDを発行してToppageに遷移する関数
  const handleGuestStart = () => {
    const generatedId = `guest_${Math.random().toString(36).substr(2, 9)}`; // 仮IDを生成
    navigate("/toppage", { state: { guestId: generatedId } }); // 仮IDを渡してToppageに遷移
  };

  return (
    <div className="loginpage">
      <div className="title">思い出射撃</div>

      {/* エラーメッセージがある場合に表示 */}
      {error && <div className="error-message">{error}</div>}

      {/* Googleログインボタンとサインアウトボタンの表示切り替え */}
      <div className="login">
        {user ? (
          <>
            <UserInfo />
            <Button onClick={() => auth.signOut()}>
              <p>サインアウト</p>
            </Button>
          </>
        ) : (
          <Button onClick={signInWithGoogle}>
            <p>ログイン</p>
          </Button>
        )}
      </div>

      {/* ログインせずに始めるボタン */}
      <div className="no-login">
        <Button onClick={handleGuestStart}>ログインせずに始める</Button>
      </div>
    </div>
  );
};

// ユーザー情報を表示するコンポーネント
function UserInfo() {
  return (
    <div>
      <p>ユーザーがログインしています</p>
    </div>
  );
}

export default LoginPage;
