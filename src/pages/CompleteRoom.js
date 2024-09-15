import React, { useState,useEffect} from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "../styles/CompleteRoom.css";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import Button from '../components/Button_orange/Button_orange';
import { db } from "../firebase/firebase-app";
import {
  doc,
  getDoc,
} from "firebase/firestore";

// アップロードされた矢印画像
import LeftArrowIcon from "../assets/image/leftarrow.png";
import RightArrowIcon from "../assets/image/rightarrow.png";
import Spinner from "../components/Spinner/Spinner";


const CompleteRoom = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [photos, setPhotos] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  // roomIdを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromQuery = params.get("roomId");

    if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
    }
  }, [location.search]);

  useEffect(() => {
    if (roomId) {
      const roomDocRef = doc(db, "selected_images", roomId);

      const fetchPhotos = async () => {
        try {
          const docSnap = await getDoc(roomDocRef);
          if (docSnap.exists()) {
            const roomData = docSnap.data();
            setPhotos(roomData.photos || []);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching photos : ", error);
        }
      };
      
      fetchPhotos();
    }
  }, [roomId]);
  
  
  const handleNext = () => {
    if (photos) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };
  
  const handlePrev = () => {
    if (photos) {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + photos.length) % photos.length
    );
    }
};

const goToSlide = (index) => {
  setCurrentIndex(index);
  };

  const handleNextTV = () => {
    if (roomId) {
      navigate(`/frame-selection?roomId=${roomId}`, {
        state: { from: "complete-room", roomId, userId },
      });
    } else {
      console.error("roomId が存在しません。");
    }
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
            {
              photos ? (
                <img
                  src={photos[currentIndex]}
                  alt="swipeable content"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  className="image nopointer"
                />
              ):<Spinner />
            }

            {/* 右矢印ボタン */}
            <button className="right-arrow" onClick={handleNext}>
              <img src={RightArrowIcon} alt="right arrow" />
            </button>
          </div>

          {/* インジケーター */}
          <div className="indicators">
            {photos?.map((_, index) => (
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
          <Button onClick={handleNextTV}>次へ</Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRoom;
