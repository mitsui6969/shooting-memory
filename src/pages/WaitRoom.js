import React, { useState, useEffect } from "react";
import "../App.css";
import "../styles/WaitRoom.css";
import { useLocation } from "react-router-dom";
import Spinner from "../components/Spinner/Spinner";
import Button from "../components/Button_orange/Button_orange";
import {
  useNavigate,
  // useParams
} from "react-router-dom";
import { db } from "../firebase/firebase-app";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const WaitRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const params = useParams();
  const [message, setMessage] = useState("");

  //　どの画面から遷移してきたかを判定
  useEffect(() => {
    if (location.state && location.state.from === "game-start") {
      setMessage("GameStart");
    } else if (location.state && location.state.from === "Toppage") {
      setMessage("Toppage");
    } else if (location.state && location.state.from === "create-room") {
      setMessage("CreateRoom");
    }
  }, [location.state]);

  // ホストがはじめるボタンをクリックしたときの処理
  const handleStartClick = async () => {
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("roomId", "==", "test"));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (roomDoc) => {
        const roomDocRef = doc(db, "rooms", roomDoc.id);
        await updateDoc(roomDocRef, {
          isActive: true,
        });
        console.log(`Room ${roomDoc.id} updated successfully`);
      });
    } catch (error) {
      console.error("Error updating room: ", error);
    }
  };

  // isAciveの変更を監視
  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("roomId", "==", "test"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const roomData = doc.data();
        if (roomData.isActive) {
          navigate("/shooting-screen");
        }
      });
    });

    return () => unsubscribe();
  }, [navigate]);

  // isReadyの変更を監視
  useEffect(() => {
    if (message === "GameStart") {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("roomId", "==", "test"));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const roomDocRef = doc.ref;

          const membersRef = collection(roomDocRef, "participants");
          const membersUnsubscribe = onSnapshot(
            membersRef,
            (membersSnapshot) => {
              const membersData = membersSnapshot.docs.map((memberDoc) =>
                memberDoc.data()
              );

              // メンバー全員の isReady が true か確認
              if (membersData.every((member) => member.isReady)) {
                navigate("/shooting-screen");
              }
            }
          );

          return () => membersUnsubscribe();
        });
      });

      return () => unsubscribe();
    }
  }, [message, navigate]);

  return (
    <div className="waitroom">
      <div className="spinner-container">
        <Spinner />
      </div>

      {message === "Toppage" && (
        <div className="text">ホストが開始するまでしばらくお待ちください</div>
      )}

      {message === "CreateRoom" && (
        <>
          <div className="text-host">参加人数〇人</div>
          <div className="start-button">
            <Button onClick={handleStartClick}>はじめる</Button>
          </div>
        </>
      )}

      {message === "GameStart" && (
        <div className="text">画像が出揃うまで少々お待ちください</div>
      )}
    </div>
  );
};

export default WaitRoom;
