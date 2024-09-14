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
  const { roomId } = location.state || {}; // roomIdを受け取る

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // 画像の数を2枚までに制限
    if (files.length + selectedImages.length > 2) {
      alert("画像は2枚まで選択できます。");
      return;
    }

    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 2)); // 最大2枚まで
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId) {
      alert("Room ID が見つかりません");
      return;
    }

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
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            null,
            (error) => {
              console.error("エラー:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`画像 ${i + 1} のダウンロードURL:`, downloadURL);
              imageUrls.push(downloadURL); // URLを配列に追加

              // FirestoreにアップロードされたURLを保存
              await updateDoc(docRef, {
                photos: arrayUnion(downloadURL), // roomIdを使用してphotos配列にURLを追加
              });

              resolve();
            }
          );
        });
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
    }

    // すべての画像がアップロード完了したら次のページへ遷移
    navigate('/wait-room', { state: { roomId, from: 'game-start' } });
  };

  return (
    <div className='gamestart'>
      <div className='text-base name'>名前</div>
      <div className='text-base select'>最大2枚の画像を選択してください</div>

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
