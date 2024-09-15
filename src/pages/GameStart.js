import React, { useState, useEffect } from "react";
import "../App.css";
import "../styles/GameStart.css";
import Button from "../components/Button_orange/Button_orange";
import { useNavigate } from "react-router-dom";
import Images from "../assets/image/images.png";
import { storage } from "../firebase/firebase-app";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/firebase-app";
import { useLocation } from "react-router-dom";

const GameStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const { userId } = location.state;

  // roomIdを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromQuery = params.get("roomId");

    if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
    }
  }, [location.search]);

  // 画像の選択
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // 画像の数を2枚までに制限
    if (files.length + selectedImages.length > 2) {
      alert("画像は2枚まで選択できます。");
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files].slice(0, 2));
  };

  // 完了ボタンをクリックしたときの処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomDocRef = doc(db, "rooms", roomId);

    if (selectedImages.length > 0) {
      const imageUrls = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("エラー:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`画像 ${i + 1} のダウンロードURL:`, downloadURL);
              imageUrls.push(downloadURL);

              await updateDoc(roomDocRef, {
                photos: arrayUnion(downloadURL),
              });

              resolve();
            }
          );
        });
      }
    }

    const participantsRef = collection(roomDocRef, "participants");
    const participantDocRef = doc(participantsRef, userId);

    try {
      await setDoc(participantDocRef, {
        name: name,
        isReady: true,
      });
      console.log("participantsコレクションにデータを追加しました");
    } catch (error) {
      console.error("participantsコレクションの更新に失敗しました:", error);
    }

    try {
      await updateDoc(roomDocRef, {
        count: increment(1),
      });
      console.log("roomsコレクションのcountが1増えました");
    } catch (error) {
      console.error("roomsコレクションのcountの更新に失敗しました:", error);
    }

    // すべての画像がアップロード完了したら次のページへ遷移
    navigate(`/wait-room?roomId=${roomId}`, {
      state: { userId, from: "game-start" },
    });
  };

  return (
    <div className="gamestart">
      <h3 className="text-base name">名前</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="input-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
        />
        <h3 className="text-base select">最大2枚の画像を選択してください</h3>
        <div className="image-uploader">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            multiple // 複数選択を許可
            onChange={handleImageChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {/* 選択した画像がある場合はそれを表示、なければデフォルト画像 */}
            {selectedImages.length > 0 ? (
              selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index + 1}`}
                  className="upload-image"
                />
              ))
            ) : (
              <img src={Images} alt="Upload" className="upload-image" />
            )}
          </label>
        </div>

        <div className="start-button">
          <Button type="submit">完了</Button>
        </div>
      </form>
    </div>
  );
};

export default GameStart;
