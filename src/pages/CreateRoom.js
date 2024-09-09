import React, { useState } from 'react'
// import "../App.css";
import "./CreateRoom.css"
import "../pages/Toppage.css"
import Button from '../components/Button_orange/Button_orange';

const CreateRoom = () => {
  const[selectedValue,setSelectedValue] = useState('')
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <div className="titleName">タイトル</div>
        
      <form className='inputform'>
        <input
          type='text'
          className="link-input_title"
        />
      </form>

      <div className='nanigaiikana'>アップロード写真枚数</div>

      <div className='selectbox'>
        <select value={selectedValue} onChange={handleChange}>
          <option value="">選択してください</option>
          <option value="5枚">5枚</option>
          <option value="6枚">6枚</option>
          <option value="7枚">7枚</option>
          <option value="8枚">8枚</option>

        </select>
      </div>
      <div className="toppage">
        <div className='attention'>※注意<br/>参加人数上限は4人です。<br/>写真アップロード上限は8枚です。</div>
          <div className='create'>
            <Button>
              作成
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
