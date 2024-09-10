import React, { useState } from 'react'
import "../styles/CreateRoom.css";
import Button from '../components/Button_orange/Button_orange';

const CreateRoom = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className='CreateRoom'>
      <div className="titleName">タイトル</div>

      <form className='inputform'>
        <input
          type='text'
          className="link-input_title"
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
          <Button type="submit">
            作成
          </Button>

        </div >
      </form>
      <div className='attention'>※注意<br />参加人数上限は4人です。<br />写真アップロード上限は8枚です。</div>
    </div >
  );
};

export default CreateRoom;
