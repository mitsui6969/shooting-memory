import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate, useLocationをインポート
import "../styles/Toppage.css"; // CSSファイルをインポート
import Modal from "../components/Modal/Modal";
import Button from "../components/Button_white/Button_white";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toppage = () => {
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義
  const location = useLocation(); // useLocationで渡されたstateを取得
  const { userId, guestId } = location.state || {}; // userIdまたはguestIdを取得

  const [link, setLink] = useState(""); // 入力フォームの状態管理

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    const id = userId || guestId; // ログインIDか仮IDを使用

    if (id) {
      // 次のページにIDを渡しながら遷移
      navigate("/wait-room", { state: { from: "Toppage", id } });
    } else {
      console.error("ユーザーIDがありません。次のページに遷移できません。");
    }
  };

  // 「部屋を作成」ボタンが押されたときの処理
  const handleCreateRoom = () => {
    const id = userId || guestId; // ログインIDか仮IDを使用
    if (id) {
      // CreateRoomにIDを渡しながらページ遷移
      navigate("/create-room", { state: { id } });
    } else {
      console.error("ユーザーIDがありません。部屋作成に遷移できません。");
    }
  };

  const ModalContent = () => {
    return (
      <div>
        <p>1, ---------------</p>
        <p>2, ---------------</p>
        <p>3, ---------------</p>
        <div className="modal-center">
          <button className="modal-button" onClick={() => setShowUsage(false)}>
            完全に理解した
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="toppage">
      <div className="title">思い出射撃</div>

      <div className="main-container">
        <div className="createroom">
          <Button onClick={handleCreateRoom}>部屋を作成</Button> {/* CreateRoomに遷移 */}
        </div>
        <form onSubmit={handleLinkSubmit} className="toppage-form">
          <input
            className="link-input"
            type="text"
            placeholder="リンクをお持ちの方はこちら"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit" className="submit-link">
            <FontAwesomeIcon icon={faCircleRight} size="2xl" />
          </button>
        </form>

        <Modal
          show={showUsage}
          setShow={setShowUsage}
          title={"使い方"}
          content={ModalContent()}
          action={
            <div className="rule">
              <Button onClick={() => setShowUsage(true)}>使い方</Button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Toppage;
