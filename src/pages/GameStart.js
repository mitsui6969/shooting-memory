import React, { useState } from 'react';
import "../App.css";
import "../styles/GameStart.css";
import Button from '../components/Button_orange/Button_orange';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/image/images.png";
import { storage } from '../firebase/firebase-app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from '../firebase/firebase-app';
import { useLocation } from 'react-router-dom';

const GameStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(""); // エラーメッセージ用のステートを追加
  const { roomId } = location.state || {};

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 2) {
      setError("画像は2枚まで選択できます。");
      return;
    }

    setError(""); // エラーをリセット
    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId) {
      setError("Room ID が見つかりません");
      return;
    }

    try {
      const docRef = doc(db, "selected_images", roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("新しいドキュメントを作成します。");
        await setDoc(docRef, { photos: [] });
      }

      if (selectedImages.length > 0) {
        const imageUrls = [];

        for (let i = 0; i < selectedImages.length; i++) {
          const image = selectedImages[i];
          const storageRef = ref(storage, `images/${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);

          try {
            await new Promise((resolve, reject) => {
              uploadTask.on('state_changed',
                null,
                (error) => {
                  console.error("画像アップロード中のエラー:", error);
                  setError(`画像 ${i + 1} のアップロードに失敗しました。`);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  console.log(`画像 ${i + 1} のダウンロードURL:`, downloadURL);
                  imageUrls.push(downloadURL);

                  try {
                    await updateDoc(docRef, {
                      photos: arrayUnion(downloadURL),
                    });
                    resolve();
                  } catch (error) {
                    console.error("Firestoreへの更新中にエラーが発生しました:", error);
                    setError("画像のURLの保存に失敗しました。");
                    reject(error);
                  }
                }
              );
            });
          } catch (error) {
            console.error("アップロードプロセス全体でエラーが発生しました:", error);
            setError("画像のアップロード中にエラーが発生しました。");
            return; 
          }
        }
      }

      try {
        const roomDocRef = doc(db, "rooms", roomId);
        await updateDoc(roomDocRef, {
          count: increment(1),
        });
        console.log("roomsコレクションのcountが1増えました");
      } catch (error) {
        console.error("roomsコレクションのcountの更新に失敗しました:", error);
        setError("ルーム情報の更新に失敗しました。");
      }

      setError(""); // エラーをリセット
      navigate('/wait-room', { state: { roomId, from: 'game-start' } });
    } catch (error) {
      console.error("データベース操作中にエラーが発生しました:", error);
      setError("処理中に問題が発生しました。");
    }
  };

  return (
    <div className='gamestart'>
      <div className='text-base name'>名前</div>
      <div className='text-base select'>最大2枚の画像を選択してください</div>

      {error && <div className="error-message">{error}</div>} {/* エラーメッセージを表示 */}

      <form onSubmit={handleSubmit}>
        <input
          className='input-name'
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
            {selectedImages.length > 0 ? (
              selectedImages.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Selected ${index + 1}`} className="upload-image" />
              ))
            ) : (
              <img src={Images} alt="Upload" className="upload-image" />
            )}
          </label>
        </div>

        <div className='start-button'>
          <Button type="submit">完了</Button>
        </div>
      </form>
    </div>
  );
};

export default GameStart;
