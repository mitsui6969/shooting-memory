import React, { useState } from 'react';
import "../App.css";
import "./GameStart.css";
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/images.png"; // ローカル画像のインポート

const GameStart = () => {
  const navigate = useNavigate(); // navigate関数を定義
  const [name, setName] = useState(""); // 入力フォームの状態管理

  // フォーム送信時の関数を定義
  const handleLinkSubmit = (event) => {
    event.preventDefault();
    console.log("名前が送信されました: ", name); // デバッグ用にコンソールに表示
    navigate('/WaitRoom');
  };

  const [selectedImage, setSelectedImage] = useState(null);

  // 画像が選択されたときの処理
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // ファイルのURLを生成してセット
    }
  };

  // 画像がアップロードされたときの処理
  const handleUpload = () => {
    if (selectedImage) {
      console.log('画像がアップロードされました！');
      // アップロード処理をここで実行（例：サーバーにPOSTリクエストを送る）
    }
  };

  return (
    <div className='gamestart'>
      <div className="start-button">
        <Button onClick={() => navigate('/WaitRoom')}>完了</Button>
      </div>

      <div className='text name'>名前</div>
      <div className='text select'>〇枚選択してください</div>

      <form onSubmit={handleLinkSubmit} className='form'>
        <span className="spacer" />
        <input
          className="input-name"
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)} // 入力値を状態に反映
        />
      </form>

      <div className="image-uploader">
        <input 
          type="file" 
          id="file-input" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="file-input" 
        />
				<label htmlFor="file-input" className="file-label">
          <img src={Images} alt="Upload" className="upload-image" />
        </label>
        {selectedImage && (
          <div className="preview-container">
            <img src={selectedImage} alt="Selected" className="preview-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStart;
