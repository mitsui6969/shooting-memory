import React, { useState } from 'react';
import "../App.css";
import "../styles/GameStart.css";
import Button from '../components/Button_orange/Button_orange';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/image/images.png"; // ローカル画像のインポート
import { storage } from '../firebase/firebase-app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const GameStart = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // 複数の画像を管理

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

    if (selectedImages.length > 0) {
      selectedImages.forEach((image, index) => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', 
          null, // 状態の変化に対するコールバックを削除
          (error) => {
            console.error("エラー:", error);
          }, 
          async () => {
            // アップロード完了後の処理
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`画像 ${index + 1} のダウンロードURL:`, downloadURL);

            // すべての画像がアップロード完了したら次のページへ遷移
            if (index === selectedImages.length - 1) {
              navigate('/wait-room', { state: { from:"game-start" } });
            }
          }
        );
      });
    } else {
      // 画像が選択されていない場合でも名前だけで遷移する
      console.log("名前が送信されました: ", name);
      navigate('/wait-room', { state: { from: 'game-start' } });
    }
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
