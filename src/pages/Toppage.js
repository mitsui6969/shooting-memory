import React, { useEffect, useState } from "react";
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

  // ページ遷移時にIDがない場合、ログインページにリダイレクト
  useEffect(() => {
    if (!userId && !guestId) {
      navigate("/login-page"); // IDがない場合はログインページに遷移
    }
  }, [userId, guestId, navigate]);

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
    const id = userId || guestId;
    if (id) {
      // CreateRoomにIDを渡しながらページ遷移
      navigate("/create-room", { state: { from: "CreateRoom", id } });
    } else {
      console.error("ユーザーIDがありません。部屋作成に遷移できません。");
    }
  };

  const ModalContent = () => {
    return (
      <div className="top-modal">
        <p>
          「思い出射的」は、友人や家族と一緒に思い出の写真を使って楽しむ新感覚の<br/>
          射的ゲームアプリです
        </p>
        <p>1, ホストが部屋を作成し、招待リンクを共有して参加者を募ります</p>
        <p>2, 参加者は名前を入力し、1～2枚の大切な写真をアップロード</p>
        <p>
          3,
          射的が始まると、かわいいぬいぐるみの中から一つを選んでクリックし、隠された写真を楽しむことができます
        </p>
        <p>
          4,
          参加者はそれぞれ一回ずつ弾を打つチャンスがあり、最後に皆が選んだ写真を使って素敵なコラージュが作成でき、思い出を一つの作品にまとめます
        </p>
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
          <Button onClick={handleCreateRoom}>部屋を作成</Button>{" "}
          {/* CreateRoomに遷移 */}
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
