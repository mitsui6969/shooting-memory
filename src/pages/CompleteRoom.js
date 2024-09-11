import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/CompleteRoom.css";
import "../App.css";
import Button from '../components/Button_orange/Button_orange';

const imageList = [
  "/images/image1.jpg", // Add your image paths here
  "/images/image2.jpg",
  "/images/image3.jpg",
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
          <div className="white-box" {...handlers}>
            <img
              src={imageList[currentIndex]}
              alt="swipeable content"
              className="image"
            />
          </div>
    <div className="next">
    <Button type="submit">
        次へ
    </Button>
    </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRoom;