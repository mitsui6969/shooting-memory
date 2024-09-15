import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "../styles/CompleteRoom.css";
import "../App.css";
import Button from '../components/Button_orange/Button_orange';
import Image1 from "../assets/image/sample.png";
import Image2 from "../assets/image/sample2.png";
import Image3 from "../assets/image/sample3.png";

// アップロードされた矢印画像
import LeftArrowIcon from "../assets/image/leftarrow.png";
import RightArrowIcon from "../assets/image/rightarrow.png";

const imageList = [
  Image1,
  Image2,
  Image3,
];

const CompleteRoom = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // useNavigateフックを使用

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + imageList.length) % imageList.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleNextClick = () => {
    navigate('/frame-selection'); // '/nextpage'を遷移先のURLに変更
  };

  return (
    <div>
      <div className="coordinate">
        <div>
          <h2>出揃いました</h2>
          <div className="white-box" {...handlers}>
            {/* 左矢印ボタン */}
            <button className="left-arrow" onClick={handlePrev}>
              <img src={LeftArrowIcon} alt="left arrow" />
            </button>

            {/* 画像表示 */}
            <img
              src={imageList[currentIndex]}
              alt="swipeable content"
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
              className="image nopointer"
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
                className={currentIndex === index ? "active" : ""}
                onClick={() => goToSlide(index)}
              >
                ●
              </span>
            ))}
          </div>

          {/* 次へボタン */}
          <div className="image-button-container">
            <Button onClick={handleNextClick}>次へ</Button> {/* クリック時にページ遷移 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRoom;
