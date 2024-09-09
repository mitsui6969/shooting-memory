import React, { useState } from 'react'; // useStateを追加してインポート
import "../App.css";
import "./GameStart.css";
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/images.png"; // ローカル画像のインポート

const GameStart = () => {
  const navigate = useNavigate(); // navigate関数を定義
  const [name, setName] = useState(""); // 入力フォームの状態管理

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("名前が送信されました: ", name); // デバッグ用にコンソールに表示
    // ページ遷移時にstateとして情報を渡す
    navigate('/waitroom', { state: { from: 'gamestart' } });
  };









  return (
    <div className='gamestart'>

      <div className='text-base name'>名前</div>
      <div className='text-base select'>〇枚選択してください</div>

      <form onSubmit={handleSubmit}>
        <input
          className='input-name'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
        />
        <div className='start-button'>
          <Button type="submit">完了</Button>
        </div>
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
        {/* アップロードボタンを追加し、画像が選択された場合に表示 */}
        {selectedImage && (
          <div className="upload-button">
            <Button onClick={handleUpload}>画像をアップロード</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStart;
