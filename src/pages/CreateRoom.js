import React, { useState } from "react";
import "../styles/CreateRoom.css";
import Button from "../components/Button_orange/Button_orange";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase-app";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"; // updateDocをインポート

const CreateRoom = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomLink, setRoomLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(""); // コピー成功メッセージの状態
  const [roomId, setRoomId] = useState(""); // roomIdを保持
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // 自分のidを保持

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const roomsCollectionRef = collection(db, "rooms");

      // Firestoreに新しいドキュメントを作成
      const newRoomDocRef = await addDoc(roomsCollectionRef, {
        roomName: title,
        photoLimit: selectedValue,
        createdBy: id,
        isActive: true,
        createdAt: new Date(), // 現在の日時を保存
        count: 0,
      });

      // ドキュメントのIDを取得して、roomIdとして使用
      const newRoomId = newRoomDocRef.id;
      const roomLink = `${window.location.origin}/wait-room?roomId=${newRoomId}`;
      setRoomLink(roomLink);
      setRoomId(newRoomId);

      // roomIdとリンクをFirestoreに保存する
      const roomDocRef = doc(db, "rooms", newRoomId); // ドキュメント参照を取得
      await updateDoc(roomDocRef, {
        roomId: newRoomId,
        link: roomLink,
        GameStatus: "wait",
      });

      console.log("新しい部屋が作成されました。ドキュメントID:", newRoomId);

      setIsModalOpen(true);
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  // リンクをクリップボードにコピーする関数
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink).then(
      () => {
        setCopySuccess("");
      },
      () => {
        setCopySuccess("");
      }
    );
  };

  // 待機画面へ移動するときにroomIdを渡す
  const handleCloseModal = () => {
    navigate(`/wait-room`, { state: { from: "create-room", roomId } });
  };

  return (
    <div className="CreateRoom">
      <div className="titleName">タイトル</div>

      <form className="inputform" onSubmit={handleSubmit}>
        <input
          type="text"
          className="link-input_title"
          value={title}
          onChange={handleTitleChange}
          placeholder="タイトルを入力してください"
        />
        <div className="upload-image-num-select">
          <span className="nanigaiikana">アップロード写真枚数</span>

          <div className="selectbox">
            <select value={selectedValue} onChange={handleChange}>
              <option value="">選択してください</option>
              <option value="5">5枚</option>
              <option value="6">6枚</option>
              <option value="7">7枚</option>
              <option value="8">8枚</option>
            </select>
          </div>
        </div>

        <div className="create">
          <Button type="submit">作成</Button>
        </div>
      </form>

      <div className="attention">
        ※注意
        <br />
        参加人数上限は4人です。
        <br />
        写真アップロード上限は8枚です。
      </div>

      {/* モーダル表示部分 */}
      {isModalOpen && (
        <div className="modal-create">
          <div className="modal-content-create">
            <p>リンクを共有</p>
            <p className="url-create">
              <a href={roomLink}>{roomLink}</a>
            </p>
            <Button onClick={copyToClipboard}>リンクをコピー</Button>
            <p>{copySuccess}</p> {/* コピー成功メッセージ */}
            <Button onClick={handleCloseModal}>待機画面へ</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
