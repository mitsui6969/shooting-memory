import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/EditFinPage.css";
import "../App.css";
import Button from '../components/Button_orange/Button_orange';
import { doc, collection, onSnapshot } from "firebase/firestore"; // Firebase Firestore関連のimport
import { db } from "../firebase/firebase-app"; // Firebase設定ファイルのimport
import LeftArrowIcon from "../assets/image/leftarrow.png";
import RightArrowIcon from "../assets/image/rightarrow.png";

const EditFinPage = () => {
  const [imageList, setImageList] = useState([{}]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // スワイプ操作の設定
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // 次の画像に移動
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  // 前の画像に移動
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + imageList.length) % imageList.length
    );
  };

  // 特定のスライドに移動
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Firebase
  useEffect(() => {
    const roomID = "testRoom";
    const participantsRef = collection(db, "rooms", roomID, "participants");

    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const updatedImageList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          user: data.name || '匿名さん',
          image: data.collageImage
        };
      });
      
      setImageList(updatedImageList);
    });

    // コンポーネントがアンマウントされたときにリスナーを解除
    return () => unsubscribe();
  }, []);

  return (
    <div className="all-contain">
      {imageList.length > 0 ? (
        <>
          <h2>{imageList[currentIndex].user}</h2>

          <div className="view-items-container">
            <div className="back-image-box" {...handlers}>
              {/* 左矢印ボタン */}
              <button className="left-arrow" onClick={handlePrev}>
                <img src={LeftArrowIcon} alt="left arrow" />
              </button>

              {/* 画像表示 */}
              <img
                src={imageList[currentIndex].image}
                alt="swipeable content"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                className="collaged-image"
              />

              {/* 右矢印ボタン */}
              <button className="right-arrow" onClick={handleNext}>
                <img src={RightArrowIcon} alt="right arrow" />
              </button>
            </div>

            {/* インジケーター */}
            <div className="indicators">
              {imageList.map((_, index) => (
                <span
                  key={index}
                  className={`indicators-span ${currentIndex === index ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                >
                  ●
                </span>
              ))}
            </div>
          </div>

          {/* 次へボタン */}
          <div className="image-button-container">
            <Button>退出する</Button>
          </div>
        </>
      ) : (
        <p>画像を読み込み中...</p>
      )}
    </div>
  );
};

export default EditFinPage;
