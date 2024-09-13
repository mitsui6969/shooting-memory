import React, { useEffect, useState } from "react";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-app";
import { collection, doc, getDocs } from "firebase/firestore";

const ShootingScreen = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [randomImage, setRandumImage] = useState(null);

  useEffect(() => {
    // データがすでに存在している場合は、fetchをスキップ
    if (photos.length > 0) {
      return;
    }

    const fetchPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "selected_images"));
        const fetchedPhotos = [];

        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            fetchedPhotos.push(...doc.data().photos);
            console.log("fetchedPhotos", fetchedPhotos);
          }
        });

        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    };

    fetchPhotos();
  }, [photos]);

  // 画像クリック時に発火
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * photos.length);
    setRandumImage(photos[randomIndex]);
    console.log("randomIndex", randomIndex);
    console.log("rondumImage", randomImage);
    setShowSquare(true);
    setIsClosing(false);
  };

  const handleNext = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSquare(false);
      setIsClosing(false);
    }, 1000);
  };

  return (
    <div className="shooting-container">
      <h2>一つ的を選んでください</h2>
      <div className="target-container">
        <img src={bearImage} alt="target" onClick={handleClick} />
        <img src={usagiImage} alt="target" onClick={handleClick} />
        <img src={weddingbearImage} alt="target" onClick={handleClick} />
        <img src={bearImage} alt="target" onClick={handleClick} />
        <img src={usagiImage} alt="target" onClick={handleClick} />
        <img src={bearImage} alt="target" onClick={handleClick} />
        <img src={usagiImage} alt="target" onClick={handleClick} />
        <img src={bearImage} alt="target" onClick={handleClick} />
      </div>

      {showSquare && (
        <div className={`click-target ${isClosing ? "closing" : ""}`}>
          <img src={randomImage} alt="sample" />
          <button onClick={handleNext}>次の人へ</button>
        </div>
      )}
    </div>
  );
};

export default ShootingScreen;
