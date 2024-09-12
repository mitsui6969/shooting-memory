import React, { useState, useEffect } from "react";
import "../styles/EditFinPage.css";
import Images1 from "../assets/sample.png";
import Images2 from "../assets/sample2.png";
import Images3 from "../assets/sample3.png";
import Images4 from "../assets/sample2.png";  // 4つ目の画像をインポート
import Button from '../components/Button_orange/Button_orange';

const EditFinPage = () => {
  // 任意の位置を指定して画像の座標を管理する
  const [positions, setPositions] = useState({
    firstImage: { top: '130px', left: '30px', borderColor: 'blue', zIndex: 0 },  // 1つ目の画像の初期座標
    secondImage: { top: '150px', left: '50px', borderColor: 'green', zIndex: 0 }, // 2つ目の画像の初期座標
    thirdImage: { top: '170px', left: '70px', borderColor: 'red', zIndex: 0 },   // 3つ目の画像の初期座標
    fourthImage: { top: '190px', left: '90px', borderColor: 'purple', zIndex: 0 } // 4つ目の画像の初期座標
  });

  // 一番右下に来た画像を前面に出すために z-index を管理
  const updateZIndex = () => {
    setPositions((prevPositions) => {
      // 4つの画像のtop, leftの値でソートして、一番右下の画像を前面にする
      const images = [
        { name: 'firstImage', ...prevPositions.firstImage },
        { name: 'secondImage', ...prevPositions.secondImage },
        { name: 'thirdImage', ...prevPositions.thirdImage },
        { name: 'fourthImage', ...prevPositions.fourthImage }
      ];

      // top, leftの値でソートして、一番右下にある画像が前面になるようにする
      images.sort((a, b) => {
        if (parseInt(a.top) !== parseInt(b.top)) {
          return parseInt(b.top) - parseInt(a.top); // topが大きい方を前面に
        }
        return parseInt(b.left) - parseInt(a.left); // 同じtopならleftが大きい方を前面に
      });

      // ソートされた順にz-indexを割り当てる（最も右下がzIndex: 3）
      return {
        firstImage: { ...prevPositions.firstImage, zIndex: images.findIndex(i => i.name === 'firstImage') },
        secondImage: { ...prevPositions.secondImage, zIndex: images.findIndex(i => i.name === 'secondImage') },
        thirdImage: { ...prevPositions.thirdImage, zIndex: images.findIndex(i => i.name === 'thirdImage') },
        fourthImage: { ...prevPositions.fourthImage, zIndex: images.findIndex(i => i.name === 'fourthImage') }
      };
    });
  };

  // クリックするたびに画像の位置と色を逆順に入れ替える
  const handleImageClick = () => {
    setPositions((prevPositions) => ({
      firstImage: prevPositions.fourthImage,
      secondImage: prevPositions.firstImage,
      thirdImage: prevPositions.secondImage,
      fourthImage: prevPositions.thirdImage,
    }));
  };

  // 前面の画像に基づいて異なるテキストを表示する
  const getDisplayedText = () => {
    if (positions.firstImage.zIndex === 3) return "一人目";
    if (positions.secondImage.zIndex === 3) return "二人目";
    if (positions.thirdImage.zIndex === 3) return "三人目";
    return "四人目さん";
  };

  // 位置が変更されるたびに z-index を更新
  useEffect(() => {
    updateZIndex();
  }, [positions]);

  return (
    <div className="EditFinPage">
      {/* 前面に出ている画像に応じて表示するテキスト */}
      <div className="displayed-text">
        {getDisplayedText()}
      </div>

      <div className='finish-button'>
          <Button type="submit">終了</Button>
      </div>

      {/* 1つ目の画像（任意の位置に配置） */}
      <img
        src={Images1}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.firstImage.top,
          left: positions.firstImage.left,
          borderColor: positions.firstImage.borderColor,
          zIndex: positions.firstImage.zIndex,  // z-indexを適用
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />

      {/* 2つ目の画像（任意の位置に配置） */}
      <img
        src={Images2}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.secondImage.top,
          left: positions.secondImage.left,
          borderColor: positions.secondImage.borderColor,
          zIndex: positions.secondImage.zIndex,  // z-indexを適用
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />

      {/* 3つ目の画像（任意の位置に配置） */}
      <img
        src={Images3}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.thirdImage.top,
          left: positions.thirdImage.left,
          borderColor: positions.thirdImage.borderColor,
          zIndex: positions.thirdImage.zIndex,  // z-indexを適用
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />

      {/* 4つ目の画像（任意の位置に配置） */}
      <img
        src={Images4}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.fourthImage.top,
          left: positions.fourthImage.left,
          borderColor: positions.fourthImage.borderColor,
          zIndex: positions.fourthImage.zIndex,  // z-indexを適用
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />
    </div>
  );
};

export default EditFinPage;
