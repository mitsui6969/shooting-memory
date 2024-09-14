import React, { useState } from 'react';
import "../App.css";
import "../styles/GameStart.css";
import Button from '../components/Button_orange/Button_orange';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/image/images.png";
import { storage } from '../firebase/firebase-app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc, setDoc, increment } from "firebase/firestore"; // Firestore用の関数をインポート
import { db } from '../firebase/firebase-app';
import { useLocation } from 'react-router-dom';

const GameStart = () => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocationを使ってroomIdを取得
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // 複数の画像を管理
  const [error, setError] = useState(""); // エラーメッセージのステートを追加
  const [uploadProgress, setUploadProgress] = useState([]); // 画像のアップロード進捗
  const { roomId } = location.state || {}; // roomIdを受け取る

  // 画像選択時のエラーチェック
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // 画像の数を2枚までに制限
    if (files.length + selectedImages.length > 2) {
      setError("画像は2枚まで選択できます。");
      return;
    }

    setError(""); // エラーをリセット
    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 2)); // 最大2枚まで
    setUploadProgress(Array(files.length).fill(0)); // アップロード進捗を初期化
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 名前が入力されているかのチェック
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

    setError(""); // エラーメッセージをリセット

    const docRef = doc(db, "selected_images", roomId); // roomIdに基づいて"rooms"コレクション内のドキュメントを参照

    // Firestoreで指定されたroomIdのドキュメントが存在するか確認
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // ドキュメントが存在しない場合は新しいドキュメントを作成
      console.log("新しいドキュメントを作成します。");
      await setDoc(docRef, { photos: [] });
    }

    if (selectedImages.length > 0) {
      const imageUrls = [];

      // 画像をアップロードし、そのURLを取得
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // 画像アップロード
        try {
          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                // アップロード進捗を計算
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prevProgress => {
                  const newProgress = [...prevProgress];
                  newProgress[i] = progress;
                  return newProgress;
                });
                console.log(`画像 ${i + 1} のアップロード進捗: ${progress}%`);
              },
              (error) => {
                console.error("アップロード中のエラー:", error);
                setError(`画像 ${i + 1} のアップロードに失敗しました。`);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log(`画像 ${i + 1} のダウンロードURL:`, downloadURL);
                imageUrls.push(downloadURL); // URLを配列に追加

                // FirestoreにアップロードされたURLを保存
                try {
                  await updateDoc(docRef, {
                    photos: arrayUnion(downloadURL), // roomIdを使用してphotos配列にURLを追加
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
          console.error("画像のアップロード中にエラーが発生しました:", error);
          return;
        }
      }
    }

    // roomsコレクションのcountを1増やす処理
    const roomDocRef = doc(db, "rooms", roomId);
    try {
      await updateDoc(roomDocRef, {
        count: increment(1) // countフィールドを1増やす
      });
      console.log("roomsコレクションのcountが1増えました");
    } catch (error) {
      console.error("roomsコレクションのcountの更新に失敗しました:", error);
      setError("ルーム情報の更新に失敗しました。");
    }

    // すべての画像がアップロード完了したら次のページへ遷移
    navigate('/wait-room', { state: { roomId, from: 'game-start' } });
  };

  return (
    <div className='gamestart'>
      <div className='text-base name'>名前</div>
      <div className='text-base select'>最大2枚の画像を選択してください</div>

      {error && <div className="error-message">{error}</div>} {/* エラーメッセージ表示 */}

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
            multiple // 複数選択を許可
            onChange={handleImageChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {/* 選択した画像がある場合はそれを表示、なければデフォルト画像 */}
            <div className="image-container">
              {selectedImages[0] ? (
                <img src={URL.createObjectURL(selectedImages[0])} alt="Selected 1" className="image-left" />
              ) : (
                <img src={Images} alt="Upload" className="image-left" />
              )}
              {selectedImages[1] ? (
                <img src={URL.createObjectURL(selectedImages[1])} alt="Selected 2" className="image-right" />
              ) : (
                <img src={Images} alt="Upload" className="image-right" />
              )}
            </div>
          </label>
        </div>

        {/* アップロード進捗の表示 */}
        <div className='upload-bar'>
          {selectedImages.map((image, index) => (
            uploadProgress[index] >= 0 && (
              <div key={index} className="progress-container">
                <div className="progress-bar" style={{ width: `${uploadProgress[index]}%` }}>
                  <span className="progress-text"> {index + 1}: {Math.round(uploadProgress[index])}% </span>
                </div>
              </div>
            )
          ))}
        </div>
        

        <div className='start-button'>
          <Button type="submit">完了</Button>
        </div>
      </form>
    </div>
  );
};

export default GameStart;
