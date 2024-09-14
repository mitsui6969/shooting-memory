import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/EditFinPage.css";
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

const EditFinPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const userName = "usuerName"

  return (
      <div className="all-contain">
        <h2>{userName}</h2>
        
        <div className="view-items-container">
          <div className="back-image-box" {...handlers}>
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
                className={currentIndex === index ? "active" : ""}
                onClick={() => goToSlide(index)}
              >
                ●
              </span>
            ))}
          </div>
        </div>

        {/* 次へボタン */}
        <div className="image-button-container">
          <Button>次へ</Button>
        </div>
      </div>
  );
};

export default EditFinPage;
