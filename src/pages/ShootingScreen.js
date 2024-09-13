import React, { useEffect, useState } from "react";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
// import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-app";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const ShootingScreen = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [members, setMembers] = useState([]);
  const [randomImage, setRandumImage] = useState(null);

  // 画像取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("roomId", "==", "test"));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const photosData = doc.data();

            if (photosData.photos && photosData.members) {
              console.log("photos:", photosData.photos);
              console.log("members:", photosData.members);

              const roomData = {
                roomId: "test",
                photos: photosData.photos,
                members: photosData.members,
              };

              localStorage.setItem("roomData", JSON.stringify(roomData));
            } else {
              console.log("photosまたはmembersが存在しません");
            }
          });
        } else {
          console.log("指定されたroomIdのドキュメントは存在しません");
        }
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    };

    const storedRoomData = localStorage.getItem("roomData");

    if (storedRoomData) {
      const parsedRoomData = JSON.parse(storedRoomData);

      if (parsedRoomData.roomId === "test") {
        setPhotos(parsedRoomData.photos);
        setMembers(parsedRoomData.members);
        console.log("localStorageから取得したphotos:", parsedRoomData.photos);
        console.log("localStorageから取得したmembers:", parsedRoomData.members);
      }
    } else {
      fetchData();
    }
  }, []);

  const saveSelectedImage = async (image) => {
    try {
      const roomDocRef = doc(db, "selected_images", "test");

      await setDoc(roomDocRef, {}, { merge: true });

      await updateDoc(roomDocRef, {
        photos: arrayUnion(image),
      });

      console.log("選ばれた画像がFirestoreに追加されました:", image);
    } catch (error) {
      console.error("選ばれた画像の保存中にエラーが発生しました:", error);
    }
  };

  // 画像クリック時に発火
  const handleClick = () => {
    const randomPhotoIndex = Math.floor(Math.random() * photos.length);
    const selectedImage = photos[randomPhotoIndex];
    saveSelectedImage(selectedImage);

    setRandumImage(photos[randomPhotoIndex]);
    console.log("randomIndex", randomPhotoIndex);
    setShowSquare(true);
    setIsClosing(false);
  };

  const handleNext = () => {
    const randomMemberIndex = Math.floor(Math.random() * members.length);
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
