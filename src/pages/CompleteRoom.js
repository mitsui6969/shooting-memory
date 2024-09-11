import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/CompleteRoom.css";
import "../App.css";
import Button from '../components/Button_orange/Button_orange';
import Image1 from "../assets/sample.png"
import Image2 from "../assets/sample2.png"
import Image3 from "../assets/sample3.png"

const imageList = [
  Image1,
  Image2,
  Image3,
];

const CompleteRoom = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + imageList.length) % imageList.length
    );
  };

  return (
    <div>
      <div className="coordinate">
        <div>
          <h2>出揃いました</h2>
          <div className="white-box" {...handlers}> {/* スワイプを有効にする */}
            <img
              src={imageList[currentIndex]}
              alt="swipeable content"
              draggable="false"
              onDragStart={(e) => e.preventDefault()} 
              
              className="image nopointer"
            />
          </div>
          <div className="image-button-container">
            <Button onClick={handleNext}>
              次へ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRoom;