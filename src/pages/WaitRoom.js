import React, { useState, useEffect } from "react";
import "../App.css";
import "../styles/WaitRoom.css";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner/Spinner";
import Button from "../components/Button_orange/Button_orange";
import { db } from "../firebase/firebase-app";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { auth } from "../firebase/firebase-app";

const WaitRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [roomTitle, setRoomTitle] = useState(""); // title用のステート

  // 画面遷移元に応じてメッセージを設定
  useEffect(() => {
    const from = location.state?.from;

    if (from === "create-room") {
      setMessage("CreateRoom");
    } else if (from === "game-start") {
      setMessage("GameStart");
    } else {
      setMessage("Toppage");
    }
  }, [location.state]);

  // roomIdを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromQuery = params.get("roomId");

    if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
    }
  }, [location.search]);

  // Firestoreからroomのtitleを取得
  useEffect(() => {
    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const fetchRoomTitle = async () => {
        try {
          const docSnap = await getDoc(roomDocRef);
          if (docSnap.exists()) {
            const roomData = docSnap.data();
            setRoomTitle(roomData.roomName || "No Title"); // titleフィールドを取得してセット
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching room title: ", error);
        }
      };

      fetchRoomTitle();
    }
  }, [roomId]);

  // メンバーのIDをroomsコレクションに追加
  useEffect(() => {
    if (roomId) {
      const userId =
        auth.currentUser?.uid ||
        `guest_${Math.random().toString(36).substr(2, 9)}`;

      const roomDocRef = doc(db, "rooms", roomId);

      const addUserToRoom = async () => {
        try {
          await updateDoc(roomDocRef, {
            members: arrayUnion(userId),
          });
          console.log("User added to room members");
        } catch (error) {
          console.error("Error adding user to room members: ", error);
        }
      };

      addUserToRoom();
    }
  }, [roomId]);

  // メンバーの人数をリアルタイムで監視
  useEffect(() => {
    if (message === "CreateRoom" && roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const roomData = docSnapshot.data();
          console.log("Room data: ", roomData);
          const memberCount = Array.isArray(roomData.members)
            ? roomData.members.length
            : 0;
          setMemberCount(memberCount);
          console.log("Member count updated: ", memberCount);
        }
      });

      return () => unsubscribe();
    }
  }, [roomId, message]);

  // ホストが「はじめる」ボタンを押したときの処理
  const handleStartClick = async () => {
    if (roomId) {
      const roomRef = query(
        collection(db, "rooms"),
        where("roomId", "==", roomId)
      );
      try {
        const querySnapshot = await getDocs(roomRef);
        const updatePromises = querySnapshot.docs.map((roomDoc) => {
          const roomDocRef = doc(db, "rooms", roomDoc.id);
          return updateDoc(roomDocRef, {
            isActive: true,
          });
        });
        await Promise.all(updatePromises);
        console.log("Room updated successfully");
      } catch (error) {
        console.error("Error updating room: ", error);
      }
    }
  };

  // ホスト以外のメンバーのisActive監視
  useEffect(() => {
    if (message === "Toppage" && roomId) {
      const roomQuery = query(
        collection(db, "rooms"),
        where("roomId", "==", roomId)
      );

      const unsubscribe = onSnapshot(roomQuery, (querySnapshot) => {
        const roomDoc = querySnapshot.docs[0];
        if (roomDoc) {
          const roomData = roomDoc.data();
          if (roomData.isActive) {
            navigate("/game-start", { state: { roomId } });
          }
        }
      });

      return () => unsubscribe();
    }
  }, [roomId, navigate, message]);

  // 全メンバーのisReadyを監視
  useEffect(() => {
    if (message === "GameStart") {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("roomId", "==", roomId));

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
  }, [message, navigate, roomId]);

  return (
    <div className="waitroom">
      <div className="spinner-container">
        <Spinner />
      </div>

      {/* Room Titleの表示 */}
      <div className="room-title">
        <h2 className="roomName">{roomTitle}</h2> {/* ここでFirestoreから取得したタイトルを表示 */}
      </div>

      {message === "Toppage" && (
        <div className="text">ホストが開始するまでしばらくお待ちください</div>
      )}

      {message === "CreateRoom" && (
        <>
          <div className="text-host">参加人数: {memberCount}人</div>
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
