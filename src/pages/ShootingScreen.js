import React, { useEffect, useState, useRef } from "react";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-app";
import { collection, getDocs, query, where } from "firebase/firestore";

const ShootingScreen = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [randomImage, setRandumImage] = useState(null);
  const hasFetchedRef = useRef(false);

  // 画像取得
  useEffect(() => {
    const fetchPhotosFromDB = async () => {
      try {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("roomId", "==", "test"));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const photosData = doc.data().photos;
            console.log("photosData", photosData.photos);

            localStorage.setItem("photos", JSON.stringify(photosData));

            setPhotos(photosData || []);
          });
        } else {
          console.log("指定されたroomIdのドキュメントは存在しません");
        }
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    };

    const storedPhotos = localStorage.getItem("photos");
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    } else if (!hasFetchedRef.current) {
      fetchPhotosFromDB();
      hasFetchedRef.current = true;
    }
  }, []);

  // データベースからメンバーを取得
  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "rooms"));
  //       querySnapshot.forEach((doc) => {
  //         // console.log(doc.id, " => ", doc.data().members);
  //       });
  //     } catch (error) {
  //       // console.error("データの取得中にエラーが発生しました", error);
  //     }
  //   };

  //   fetchMembers();
  // } , []);

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
