import React, { useState, useEffect } from 'react'; 
import "../App.css";
import "./WaitRoom.css";
import { useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner/Spinner'; 
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom'; 

const WaitRoom = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // データのロードが終わった後にローディングを解除
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300000); // 300秒後にロード完了

    // どのページから来たかを確認し、メッセージを変える
    if (location.state && location.state.from === 'gamestart') {
      setMessage("GameStart");
    } else if (location.state && location.state.from === 'Toppage') {
      setMessage("Toppage");
    } else {
      setMessage("CreateRoom");
    }

    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div className='waitroom'>
      {loading ? (
        <div className="spinner-container">
          <Spinner /> {/* ローディング中はスピナーを表示 */}
        </div>
      ) : (
        <h1>コンテンツが読み込まれました！</h1>
      )}

      {message === "Toppage" && (
        <div className='text'>ホストが開始するまでしばらくお待ちください</div>
      )}

      {message === "CreateRoom" && (
        <>
          <div className='text-host'>参加人数〇人</div>
          <div className="start-button">
            <Button onClick={() => navigate('/gamestart')}>はじめる</Button>
          </div>
        </>
      )}

      {message === "GameStart" && (
        <>
          <div className='text'>画像が出揃うまで少々お待ちください</div>
        </>
      )}
    </div>
  );
};

export default WaitRoom;
