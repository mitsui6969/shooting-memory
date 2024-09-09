import React, { useState, useEffect } from 'react'; // Reactを一度だけインポート
import "../App.css";
import "./WaitRoom.css";
import { useLocation } from 'react-router-dom';
import Spinner from '../components/Spinner/Spinner'; // スピナーコンポーネントをインポート
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

const WaitRoom = () => {
  const location = useLocation(); // useLocationでstateを取得
  const navigate = useNavigate(); // navigate関数を定義
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // データのロードが終わった後にローディングを解除
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300000); // 3秒後にロード完了

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
      {message === "Toppage" ? (
        <>
          {loading ? (
            <div className="spinner-container">
              <Spinner /> {/* ローディング中はスピナーを表示 */}
            </div>
          ) : (
            <h1>コンテンツが読み込まれました！</h1>
          )}
          <div className='text'>ホストが開始するまでしばらくお待ちください</div>
        </>
      ) : (
        <>
          {loading ? (
            <div className="spinner-container">
              <Spinner /> {/* ローディング中はスピナーを表示 */}
            </div>
          ) : (
            <h1>コンテンツが読み込まれました！</h1>
          )}
          <div className='text-host'>参加人数〇人</div>
          <div className="start-button">
            <Button onClick={() => navigate('/gamestart')}>はじめる</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WaitRoom;
