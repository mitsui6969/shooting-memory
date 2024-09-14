import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import Button from "../components/Button_white/Button_white";
import "../styles/LoginPage.css"; // CSSファイルをインポート
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase/firebase-app"; // Firebase関連のインポート

const LoginPage = () => {
  const navigate = useNavigate(); // navigate関数を定義
  const [user] = useAuthState(auth); // 認証状態を取得

  // Googleサインイン関数
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

  // ユーザーがログインしたら3秒後にToppageに遷移し、ユーザーIDを渡す
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        const userId = auth.currentUser?.uid; // FirebaseでログインしているユーザーのUIDを取得
        navigate("/toppage", { state: { userId } }); // UIDを渡してToppageに遷移
      }, 3000); // 3秒待つ

      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [user, navigate]); // ユーザーがログインしたかどうかで実行

  // 仮IDを発行してToppageに遷移する関数
  const handleGuestStart = () => {
    const generatedId = `guest_${Math.random().toString(36).substr(2, 9)}`; // 仮IDを生成
    navigate("/toppage", { state: { guestId: generatedId } }); // 仮IDを渡してToppageに遷移
  };

  return (
    <div className="loginpage">
      <div className="title">思い出射撃</div>

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
      {/* ここにユーザー情報を表示 */}
      <p>ユーザーがログインしています</p>
    </div>
  );
}

export default LoginPage;
