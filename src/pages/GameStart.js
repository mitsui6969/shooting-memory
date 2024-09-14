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
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-app";
import { useLocation } from "react-router-dom";

const GameStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
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

  // 画像選択時のエラーチェックと選択処理
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 2) {
      setError("画像は2枚まで選択できます。");
      return;
    }

    setError(""); // エラーをリセット
    setSelectedImages((prevImages) => [...prevImages, ...files].slice(0, 2)); // 最大2枚まで
    setUploadProgress(Array(files.length).fill(0)); // アップロード進捗を初期化
  };

  // 選択された画像を削除
  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1); // 指定された画像を削除
    setSelectedImages(updatedImages);
  };

  // 完了ボタンのクリック処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("名前を入力してください。");
      return;
    }

    if (!roomId) {
      setError("Room ID が見つかりません");
      return;
    }

    if (selectedImages.length === 0) {
      setError("画像を最低1枚アップロードしてください。");
      return;
    }

    setError(""); // エラーをリセット

    const roomDocRef = doc(db, "rooms", roomId); // roomsコレクション内のドキュメント参照
    const docRef = doc(db, "selected_images", roomId);

    // Firestoreで指定されたroomIdのドキュメントが存在するか確認し、なければ作成
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log("新しいドキュメントを作成します。");
      await setDoc(docRef, { photos: [] });
    }

    const imageUrls = [];

    // 画像をアップロードしてFirestoreに保存
    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // アップロード進捗を計算
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[i] = progress;
              return newProgress;
            });
          },
          (error) => {
            console.error("アップロード中のエラー:", error);
            setError(`画像 ${i + 1} のアップロードに失敗しました。`);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrls.push(downloadURL); // URLを配列に追加

            try {
              await updateDoc(docRef, {
                photos: arrayUnion(downloadURL),
              });
              resolve();
            } catch (error) {
              console.error(
                "Firestoreへの更新中にエラーが発生しました:",
                error
              );
              setError("画像のURLの保存に失敗しました。");
              reject(error);
            }
          }
        );
      });
    }

    // participantsコレクションにユーザー情報を保存
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

    // roomsコレクションのcountを1増やす
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
      <div className="text-base name">名前</div>
      <div className="text-base select">最大2枚の画像を選択してください</div>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* エラーメッセージ表示 */}
      <form onSubmit={handleSubmit}>
        <input
          className="input-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
        />

        <div className="image-uploader">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            <div className="image-container">
              {selectedImages.length === 0 ? (
                <img src={Images} alt="Upload" className="image-default" />
              ) : (
                selectedImages.map((image, index) => (
                  <div className="image-wrapper" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index + 1}`}
                      className="upload-image"
                    />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </label>
        </div>

        <div className="upload-bar">
          {selectedImages.map(
            (image, index) =>
              uploadProgress[index] >= 0 && (
                <div key={index} className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress[index]}%` }}
                  >
                    <span className="progress-text">
                      画像 {index + 1}: {Math.round(uploadProgress[index])}%
                      アップロード完了
                    </span>
                  </div>
                </div>
              )
          )}
        </div>

        <div className="start-button">
          <Button type="submit">完了</Button>
        </div>
      </form>
    </div>
  );
};

export default GameStart;
