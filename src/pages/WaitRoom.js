import React, { useState, useEffect } from 'react'; // Reactを一度だけインポート
import "../App.css";
import "./WaitRoom.css";
import Spinner from '../components/Spinner/Spinner'; // スピナーコンポーネントをインポート

const WaitRoom = () => {
  const [loading, setLoading] = useState(true);

  // データのロードが終わった後にローディングを解除
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 30000); // 3秒後にロード完了

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='waitroom'>
      {loading ? (
        <div className="spinner-container">
        <Spinner /> {/* ローディング中はスピナーを表示 */}
      </div>
      ) : (
        <h1>コンテンツが読み込まれました！</h1>
      )}
    </div>
  );
};

export default WaitRoom;
