import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
import { db } from "../firebase/firebase-app";
import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
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
  const [playMember, setPlayMember] = useState(null); // 現在のプレイヤーID
  const [playMemberName, setPlayMemberName] = useState(""); // 現在のプレイヤーの名前
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

            if (roomData.currentPlayMember) {
              setPlayMember(roomData.currentPlayMember); // 現在のプレイヤーIDを設定
              console.log(
                "現在のターンのプレイヤー:",
                roomData.currentPlayMember
              );
            } else {
              // 初回の場合、最初のプレイヤーを設定して保存
              const firstMember = roomData.members[0];
              await saveCurrentPlayMember(firstMember);
              setPlayMember(firstMember);
              console.log("最初のプレイヤーを設定:", firstMember);
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

  // Firestoreの現在のプレイヤーを監視
  useEffect(() => {
    if (!roomId) return;

    const roomDocRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        if (roomData.currentPlayMember) {
          setPlayMember(roomData.currentPlayMember); // リアルタイムでプレイヤーIDを設定
          console.log("現在のプレイヤー:", roomData.currentPlayMember);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // playMemberの名前を取得
  useEffect(() => {
    const fetchPlayMemberName = async () => {
      if (!roomId || !playMember) return;

      try {
        const playMemberDocRef = doc(
          db,
          `rooms/${roomId}/participants`,
          playMember
        );
        const playMemberDoc = await getDoc(playMemberDocRef);

        if (playMemberDoc.exists()) {
          const playMemberData = playMemberDoc.data();
          setPlayMemberName(playMemberData.name); // `name` フィールドの値を設定
          console.log("現在のプレイヤーの名前:", playMemberData.name);
        } else {
          console.log("指定されたプレイヤードキュメントは存在しません");
        }
      } catch (error) {
        console.error("プレイヤーの名前の取得中にエラーが発生しました", error);
      }
    };

    fetchPlayMemberName();
  }, [roomId, playMember]);

  // プレイヤーターンを保存
  const saveCurrentPlayMember = async (nextMember) => {
    try {
      const roomDocRef = doc(db, "rooms", roomId);
      await updateDoc(roomDocRef, {
        currentPlayMember: nextMember, // 次のプレイヤーを保存
      });
      console.log("現在のプレイヤーがFirestoreに保存されました:", nextMember);
    } catch (error) {
      console.error("現在のプレイヤーの保存中にエラーが発生しました:", error);
    }
  };

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
  const handleNext = async () => {
    const currentMemberIndex = members.indexOf(playMember);
    const nextMemberIndex = currentMemberIndex + 1;

    if (nextMemberIndex < members.length) {
      const nextMember = members[nextMemberIndex];
      setPlayMember(nextMember);
      console.log("次の人:", nextMember);
      await saveCurrentPlayMember(nextMember); // 次のプレイヤーをFirestoreに保存
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
        現在のターン: {playMemberName} さん
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
