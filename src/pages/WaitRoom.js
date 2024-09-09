import React, { useState, useEffect } from 'react'; // Reactを一度だけインポート
import "../App.css";
import "./WaitRoom.css";
import Spinner from '../components/Spinner/Spinner'; // スピナーコンポーネントをインポート
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

const WaitRoom = () => {
  const navigate = useNavigate(); // navigate関数を定義
  const [loading, setLoading] = useState(true);

  // データのロードが終わった後にローディングを解除
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300000); // 3秒後にロード完了

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='waitroom'>
      {1 === 2?(
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
        <dev className="start-button">
          <Button onClick={() => navigate('/gamestart')}>はじめる</Button>
        </dev>
      </>
      )}
    </div>
  );  
};
export default WaitRoom;
