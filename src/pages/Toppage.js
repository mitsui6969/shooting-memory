import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate, useLocationをインポート
import "../styles/Toppage.css"; // CSSファイルをインポート
import Modal from "../components/Modal/Modal";
import Button from "../components/Button_white/Button_white";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../firebase/firebase-app"; // Firestoreをインポート
import { collection, doc, updateDoc, arrayUnion } from "firebase/firestore"; // collectionとupdateDocをインポート

const Toppage = () => {
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義
  const location = useLocation(); // useLocationで渡されたstateを取得
  const { userId, guestId } = location.state || {}; // userIdまたはguestIdを取得

  const [link, setLink] = useState(""); // 入力フォームの状態管理

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    const id = userId || guestId; // ログインIDか仮IDを使用

    if (id) {
      try {
        const roomsCollectionRef = collection(db, "participants"); // コレクションリファレンスを参照
        const roomRef = doc(roomsCollectionRef, "L9YQOzZ8vCzRDSSY7RXR"); // 更新する部屋の参照

        // 配列の最後に新しいIDを追加
        await updateDoc(roomRef, {
          members: arrayUnion(id), // members配列にIDを追加
        });

        console.log("IDがmembers配列の最後に追加されました:", id);
        navigate("/wait-room", { state: { from: "Toppage" } }); // 次のページに遷移
      } catch (e) {
        console.error("members配列の更新に失敗しました: ", e);
      }
    } else {
      console.error("ユーザーIDがありません。members配列を更新できません。");
    }
  };

  // 部屋を作成してFirestoreにデータを追加する関数
  const handleUpdateRoom = async () => {
    const id = userId || guestId; // ログインIDか仮IDを使用
    if (id) {
      try {
        const roomsCollectionRef = collection(db, "participants"); // コレクションリファレンスを参照
        const roomRef = doc(roomsCollectionRef, "L9YQOzZ8vCzRDSSY7RXR"); // 更新する部屋の参照
        
        await updateDoc(roomRef, {
          createdBy: id, // createdByフィールドを更新
        });
        console.log("部屋が更新されました。ID:", "L9YQOzZ8vCzRDSSY7RXR");
        navigate("/create-room", { state: { roomId: "L9YQOzZ8vCzRDSSY7RXR" } }); // 更新された部屋のIDを次のページに渡す
      } catch (e) {
        console.error("部屋の更新に失敗しました: ", e);
      }
    } else {
      console.error("ユーザーIDがありません。部屋を更新できません。");
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
          <Button onClick={handleUpdateRoom}>部屋を作成</Button> {/* 部屋を更新ボタン */}
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
