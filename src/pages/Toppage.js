import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import "../App.css";

const Toppage = () => {
  // 「使い方」ボタンを押した時に四角を表示する
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義

  const [link, setLink] = useState(""); //入力フォームの状態管理
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    console.log("入力されたリンク：", link);
    //→ボタンが押されたら待機ページに遷移
    navigate("/waitroom");
  };

  return (
    <div className="toppage">
      <div>思い出射撃</div>

      {/* 部屋作成画面に移動 */}
      <button
        className="button-common createroom"
        onClick={() => navigate("/createroom")}
      >
        部屋を作成
      </button>

      {/* リンクを入力するフォーム */}
      <form onSubmit={handleLinkSubmit}>
        <input
          type="text"
          placeholder="リンクをお持ちの方"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="link-input form1"
        />
        <button type="submit" className="button-common submit-link">
          →
        </button>
      </form>

      {/* 使い方を表示 */}
      <button
        className="button-common rule"
        onClick={() =>
          setShowUsage(true)
        } /* 「使い方」ボタンを押した時に表示 */
      >
        使い方
      </button>

      {/* showUsageがtrueの時にだけ表示する */}
      {showUsage && (
        <div className="usage-box">
          <button
            className="button-common close"
            onClick={() => setShowUsage(false)}
          >
            ×
          </button>
          <p>使い方</p>
        </div>
      )}
    </div>
  );
};

export default Toppage;
