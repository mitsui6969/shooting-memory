import React, { useState } from 'react'
import "../styles/CreateRoom.css";
import Button from '../components/Button_orange/Button_orange'
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { db } from '../firebase/firebase-app';
import { collection, addDoc } from "firebase/firestore";

const CreateRoom = () => {

  const [selectedValue, setSelectedValue] = useState('');
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示状態を管理
  const navigate = useNavigate(); // navigateを使用してページ遷移を管理

  // タイトルの入力を管理するハンドラー
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // アップロード写真枚数の選択を管理するハンドラー
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // フォーム送信時の処理
  const handleSubmit = async (event) => {
    event.preventDefault(); // ここでデフォルトのフォーム送信動作を防ぐ

    try {
      const postData = collection(db, "create_room");
      await addDoc(postData, {
        title: title,
        content: selectedValue,
      });
      console.log("タイトル:", title);
      console.log("選択された写真枚数:", selectedValue);
      setIsModalOpen(true); // フォーム送信後にモーダルを表示
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };


  // モーダルを閉じる処理とページ遷移
  const handleCloseModal = () => {
    navigate('/wait-room', { state: { from: 'create-room' } });
  };

  return (
    <div className='CreateRoom'>
      <div className="titleName">タイトル</div>

      <form className='inputform' onSubmit={handleSubmit}>
        <input
          type='text'
          className="link-input_title"
          value={title}
          onChange={handleTitleChange}
          placeholder="タイトルを入力してください"
        />
        <div className='upload-image-num-select'>
          <span className='nanigaiikana'>アップロード写真枚数</span>

          <div className='selectbox'>
            <select value={selectedValue} onChange={handleChange}>
              <option value="">選択してください</option>
              <option value="5枚">5枚</option>
              <option value="6枚">6枚</option>
              <option value="7枚">7枚</option>
              <option value="8枚">8枚</option>
            </select>
          </div>
        </div>

        <div className='create'>
          <Button type="submit" >作成</Button>
        </div>
      </form>

      <div className='attention'>
        ※注意<br />参加人数上限は4人です。<br />写真アップロード上限は8枚です。
      </div>

      {/* モーダル表示部分 */}
      {isModalOpen && (
        <div className="modal-create">
          <div className="modal-content-create">
            <p>リンクを共有</p>
            <Button onClick={handleCloseModal}>待機画面へ</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
