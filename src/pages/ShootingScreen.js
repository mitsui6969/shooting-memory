import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
import { db } from "../firebase/firebase-app";
import { getDoc, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const ShootingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  const [showSquare, setShowSquare] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [members, setMembers] = useState([]);
  const [randomImage, setRandomImage] = useState(null);
  const [playMember, setPlayMember] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // roomIdを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromQuery = params.get("roomId");

    if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
    }
  }, [location.search]);

  console.log("roomIdFromQuery:", roomId);

  // Firestoreからデータを直接取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!roomId) return;

        const roomDocRef = doc(db, "rooms", roomId);
        const docSnapshot = await getDoc(roomDocRef);

        if (docSnapshot.exists()) {
          const roomData = docSnapshot.data();

          if (roomData.photos && roomData.members) {
            console.log("photos:", roomData.photos);
            console.log("members:", roomData.members);

            setPhotos(roomData.photos);
            setMembers(roomData.members);

            if (roomData.members.length > 0) {
              setPlayMember(roomData.members[0]);
              console.log("最初のターン:", roomData.members[0]);
            }
          } else {
            console.log("photosまたはmembersが存在しません");
          }
        } else {
          console.log("指定されたroomIdのドキュメントは存在しません");
        }
      } catch (error) {
        console.error("データの取得中にエラーが発生しました", error);
      }
    };

    fetchData();
  }, [roomId]);

  const saveSelectedImage = async (image) => {
    try {
      const roomDocRef = doc(db, "selected_images", roomId);

      await setDoc(roomDocRef, {}, { merge: true });

      await updateDoc(roomDocRef, {
        photos: arrayUnion(image),
      });
      console.log("選ばれた画像がFirestoreに追加されました:", image);
    } catch (error) {
      console.error("選ばれた画像の保存中にエラーが発生しました:", error);
    }
  };

  console.log("現在のターン:", playMember);

  // 画像クリック時に発火
  const handleClick = () => {
    if (!members || members.length === 0) {
      console.error("membersが存在しません");
      return;
    }

    if (playMember !== userId) {
      alert("あなたのターンではありません");
      return;
    }

    const randomPhotoIndex = Math.floor(Math.random() * photos.length);
    const selectedImage = photos[randomPhotoIndex];
    saveSelectedImage(selectedImage);

    setRandomImage(photos[randomPhotoIndex]);
    console.log("randomIndex", randomPhotoIndex);
    setShowSquare(true);
    setIsClosing(false);

    const updatedPhotos = photos.filter(
      (_, index) => index !== randomPhotoIndex
    );
    setPhotos(updatedPhotos);
  };

  // 次の人へボタンクリック時に発火
  const handleNext = () => {
    const currentMemberIndex = members.indexOf(playMember);
    const nextMemberIndex = currentMemberIndex + 1;

    if (nextMemberIndex < members.length) {
      setPlayMember(members[nextMemberIndex]);
      console.log("次の人:", members[nextMemberIndex]);
    } else {
      navigate("/");
      console.log("全員が終了しました");
      return;
    }

    setIsClosing(true);
    setTimeout(() => {
      setShowSquare(false);
      setIsClosing(false);
    }, 1000);
  };

  return (
    <div className="shooting-container">
      <h2>一つ的を選んでください</h2>
      <p>
        現在のターン {playMember} さん
        <br />
      </p>
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
