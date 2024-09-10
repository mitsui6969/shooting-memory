import React, { useState } from "react";
import "../styles/EditFinPage.css";
import Images from "../assets/sample.png";

const EditFinPage = () => {
  // 任意の位置を指定して画像の座標を管理する
  const [positions, setPositions] = useState({
    firstImage: { top: '200px', left: '50px', borderColor: 'blue' },  // 1つ目の画像の初期座標
    secondImage: { top: '250px', left: '100px', borderColor: 'green' } // 2つ目の画像の初期座標
  });

  const handleImageClick = () => {
    // クリックするたびに画像の位置と色を入れ替える
    setPositions((prevPositions) => ({
      firstImage: prevPositions.secondImage,
      secondImage: prevPositions.firstImage,
    }));
  };

  return (
    <div className="EditFinPage">
      {/* 1つ目の画像（任意の位置に配置） */}
      <img
        src={Images}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.firstImage.top,
          left: positions.firstImage.left,
          borderColor: positions.firstImage.borderColor,
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />

      {/* 2つ目の画像（任意の位置に配置） */}
      <img
        src={Images}
        alt="moving"
        className="moving-image"
        style={{
          top: positions.secondImage.top,
          left: positions.secondImage.left,
          borderColor: positions.secondImage.borderColor,
        }}
        onClick={handleImageClick}  // クリックで位置と色を入れ替え
      />
    </div>
  );
};

export default EditFinPage;
