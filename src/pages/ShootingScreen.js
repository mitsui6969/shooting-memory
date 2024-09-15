import React, { useEffect, useState, useCallback } from "react";
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
import { get, ref, set } from "firebase/database";
import { realtimeDb } from "../firebase/firebase-app";
import { onValue } from "firebase/database";

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
  const [playMemberName, setPlayMemberName] = useState("");
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

  // プレイヤーターンを保存
  const saveCurrentPlayMember = useCallback(
    async (nextMember) => {
      try {
        const roomDocRef = doc(db, "rooms", roomId);
        await updateDoc(roomDocRef, {
          currentPlayMember: nextMember,
        });
        console.log("現在のプレイヤーがFirestoreに保存されました:", nextMember);
      } catch (error) {
        console.error("現在のプレイヤーの保存中にエラーが発生しました:", error);
      }
    },
    [roomId]
  );

  // 最初のプレイヤーを設定
  const setFirstPlayMember = useCallback(
    async (members) => {
      const firstMember = members[0];
      await saveCurrentPlayMember(firstMember);

      try {
        const docRef = doc(db, "rooms", roomId);
        await updateDoc(docRef, {
          isEnd: false,
        });
      } catch (error) {
        console.error("isEndの更新中にエラーが発生しました", error);
      }

      setPlayMember(firstMember);
      console.log("最初のプレイヤーを設定:", firstMember);
    },
    [roomId, saveCurrentPlayMember]
  );

  // データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!roomId) return;

        const roomDocRef = doc(db, "rooms", roomId);
        const docSnapshot = await getDoc(roomDocRef);

        console.log("ドキュメントの存在:", docSnapshot.exists());

        if (docSnapshot.exists()) {
          const roomData = docSnapshot.data();
          console.log("roomData:", roomData);
          if (roomData.photos && roomData.members) {
            setPhotos(roomData.photos);
            setMembers(roomData.members);

            console.log("photos:", roomData.photos);
            console.log("members:", roomData.members);

            if (roomData.currentPlayMember) {
              setPlayMember(roomData.currentPlayMember);
            } else {
              await setFirstPlayMember(roomData.members);
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
  }, [roomId, setFirstPlayMember]);

  // Firestoreの現在のプレイヤーを監視し、isEndがtrueになったら画面遷移
  useEffect(() => {
    if (!roomId) return;

    const roomDocRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        if (roomData.currentPlayMember) {
          setPlayMember(roomData.currentPlayMember);
          console.log("現在のプレイヤー:", roomData.currentPlayMember);
        }
        // isEndがtrueになったら画面遷移
        if (roomData.isEnd === true) {
          console.log("ゲーム終了: isEndがtrueになりました");
          navigate(`/complete-room?roomId=${roomId}`);
          return;
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

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
          setPlayMemberName(playMemberData.name);
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
      await saveCurrentPlayMember(nextMember);
    } else {
      const roomDocRef = doc(db, "rooms", roomId);
      await updateDoc(roomDocRef, {
        isEnd: true,
      });
      console.log("全員が終了しました");
      return;
    }

    setIsClosing(true);
    setTimeout(() => {
      setShowSquare(false);
      setIsClosing(false);
    }, 1000);
  };

  // カーソル位置を取得
  const [cursorColors, setCursorColors] = useState({});

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setCursorPosition({ x: clientX, y: clientY });

      // Firebase Realtime Databaseにカーソル位置を保存
      const cursorRef = ref(realtimeDb, `rooms/${roomId}/cursors/${userId}`);
      set(cursorRef, {
        x: clientX,
        y: clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [roomId, userId]);

  // ランダムな色を生成する関数
  const getRandomColor = useCallback(() => {
    const colors = ["orange", "blue", "black", "green"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }, []);

  // 他のユーザーのカーソル位置を取得
  const [otherCursors, setOtherCursors] = useState({});

  useEffect(() => {
    if (!roomId) return;

    const cursorsRef = ref(realtimeDb, `rooms/${roomId}/cursors`);

    // Firebase Realtime Databaseのデータをリアルタイムで取得
    const unsubscribe = onValue(cursorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const cursors = snapshot.val();
        setOtherCursors(cursors);

        // 新しい参加者のカーソルにランダムな色を割り当て
        const newCursorColors = { ...cursorColors };
        Object.keys(cursors).forEach((id) => {
          if (!newCursorColors[id]) {
            newCursorColors[id] = getRandomColor(); // 新しいユーザーにランダムな色を割り当てる
          }
        });
        setCursorColors(newCursorColors); // Stateに保存
      }
    });

    return () => unsubscribe();
  }, [roomId, cursorColors, getRandomColor]);

  return (
    <div className="shooting-container">
      <h2>一つ的を選んでください</h2>
      {Object.keys(otherCursors)
        .filter((id) => id !== userId)
        .map((id) => {
          const { x, y } = otherCursors[id];
          return (
            <div
              key={id}
              className="cursor"
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: cursorColors[id] || "black",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            />
          );
        })}
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
          <button onClick={handleNext} className="next-button">
            次の人へ
          </button>
        </div>
      )}
    </div>
  );
};

export default ShootingScreen;
