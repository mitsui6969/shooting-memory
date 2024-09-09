import React, { useState, } from 'react'; // Reactを一度だけインポート
import "../App.css";
import "./GameStart.css";
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

const GameStart = () => {
  const navigate = useNavigate(); // navigate関数を定義
  return (
    <div className='gamestart'>
      <dev className="start-button">
          <Button onClick={() => navigate('/WaitRoom')}>完了</Button>
      </dev>

			<div className='text'>名前</div>
    </div>
  );  
};
export default GameStart;