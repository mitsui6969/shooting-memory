import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import "../styles/Toppage.css"; // CSSファイルをインポート
import Modal from "../components/Modal/Modal";
import Button from "../components/Button_white/Button_white";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Toppage = () => {
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義

  const [link, setLink] = useState(""); // 入力フォームの状態管理
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    console.log("入力されたリンク：", link);
    navigate("/waitroom"); // →ボタンが押されたら待機ページに遷移
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
          <Button onClick={() => navigate("/create-room")}>部屋を作成</Button>
        </div>
        <form onSubmit={handleLinkSubmit} className="toppage-form">
          <input
            className="link-input"
            type="text"
            placeholder="リンクをお持ちの方はこちら"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            type="submit"
            className="submit-link"
            onClick={() =>
              navigate("/waitroom", { state: { from: "Toppage" } })
            }
          >
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
