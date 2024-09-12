import React, { useState } from 'react';
import '../styles/FrameSelection.css';
import titleBorder from '../assets/layoutSanple/title-border.png';
import titleNone from '../assets/layoutSanple/title-none.png';
import noneBorder from '../assets/layoutSanple/none-border.png';
import noneNone from '../assets/layoutSanple/none-none.png';
import Frame from "../components/Frame/Frame"; // Frameコンポーネントをインポート

const FrameSelection = () => {
  const layoutCatalog = [titleBorder, titleNone, noneBorder, noneNone]; // フレーム画像リスト
  const [selectedFrame, setSelectedFrame] = useState(null); // 選択されたフレームを保存

  return (
    <div className='frame-selection'>
      <h2>フレームを選択してください</h2>
      
      <div className='selection-area'>
        <div className='frames'>
          {layoutCatalog.map((src, index) => (
            <div
              key={index}
              className={`frame ${selectedFrame === src ? 'selected' : ''}`} // 選択されたフレームにクラスを追加
              onClick={() => setSelectedFrame(src)} // フレームをクリックしたときに選択
            >
              <img
                src={src}
                alt='layout'
                className='layout-sample'
              />
            </div>
          ))}
        </div>
      </div>

      {/* 選択されたフレームがある場合にFrameコンポーネントでプレビュー表示 */}
      {selectedFrame && (
        <div className='selected-frame-container'>
          <h3>選択されたフレーム</h3>
          {/* Frameコンポーネントでプレビューを表示 */}
          <Frame 
            imageCount={4} 
            title="サンプルタイトル" 
            date="2024/09/12" 
            selectColor="blue" 
            selectBorder={1} 
            selectTitle={1} 
          />
        </div>
      )}
    </div>
  );
};

export default FrameSelection;
