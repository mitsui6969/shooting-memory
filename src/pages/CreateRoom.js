import React, { useState, useEffect } from "react";
import "../styles/CreateRoom.css";
import Button from "../components/Button_orange/Button_orange";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase-app";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const CreateRoom = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomLink, setRoomLink] = useState("");

  const [copySuccess, setCopySuccess] = useState(""); // コピー成功メッセージの状態
  const [roomId, setRoomId] = useState(""); // roomIdを保持
  const [isFormValid, setIsFormValid] = useState(false); // フォームが有効かどうか
  const [isLinkCopied, setIsLinkCopied] = useState(false); // リンクがコピーされたかどうか

  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  // タイトルと写真枚数の選択を監視してフォームのバリデーションを行う
  useEffect(() => {
    if (title.trim() !== "" && ["5", "6", "7", "8"].includes(selectedValue)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, selectedValue]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return; // フォームが無効な場合、送信を中断
    }

    try {
      const roomsCollectionRef = collection(db, "rooms");

      const newRoomDocRef = await addDoc(roomsCollectionRef, {
        roomName: title,
        photoLimit: selectedValue,
        createdBy: userId,
        isActive: false,
        createdAt: new Date(),
        count: 0,
      });

      const newRoomId = newRoomDocRef.id;
      const roomLink = `${window.location.origin}/wait-room?roomId=${newRoomId}`;
      setRoomLink(roomLink);
      setRoomId(newRoomId);

      const roomDocRef = doc(db, "rooms", newRoomId);
      await updateDoc(roomDocRef, {
        roomId: newRoomId,
        link: roomLink,
        GameStatus: "wait",
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink).then(
      () => {
        setCopySuccess("リンクをコピーしました");
        setIsLinkCopied(true); // コピー成功時にリンクコピー済みフラグを立てる
      },
      () => {
        setCopySuccess("コピーに失敗しました");
      }
    );
  };

  const handleCloseModal = () => {

    if (isLinkCopied) { // リンクがコピーされている場合のみ遷移を許可
      if (roomId) {
        navigate(`/wait-room?roomId=${roomId}`, {
          state: { from: "create-room", roomId },
        });
      } else {
        console.error("roomId が存在しません。");
      }

    } else {
      alert("リンクをコピーしてください。");
    }
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
          <Button type="submit" disabled={!isFormValid}>
            作成
          </Button>
        </div>
      </form>
      <div className="attention">
        ※注意
        <br />
        参加人数上限は4人です
        <br />
        写真アップロード上限は8枚です
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
            <Button onClick={handleCloseModal} disabled={!isLinkCopied}>
              待機画面へ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;