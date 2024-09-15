import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import "../styles/WaitRoom.css";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner/Spinner";
import Button from "../components/Button_orange/Button_orange";
import { db } from "../firebase/firebase-app";
import { doc, updateDoc, getDoc, arrayUnion, increment, onSnapshot } from "firebase/firestore";

const WaitRoom = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [roomTitle, setRoomTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態
  const [count, setCount] = useState(null); // Firestoreのcount値を保持

  // userIdを取得
  const location = useLocation();
  const locationUserId = location.state?.userId;

  // 初回マウント時にuserIdを設定
  useEffect(() => {
    if (locationUserId) {
      setUserId(locationUserId);
    }
  }, [locationUserId]);

  // userIdが存在しない場合はランダムなIDを生成
  useEffect(() => {
    if (message === "Toppage" && !userId) {
      const generatedUserId = `guest_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setUserId(generatedUserId);
    }
  }, [message, userId]);

  // Firestoreのcountを1減らす
  const decrementCount = useCallback(async () => {
    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);
      try {
        await updateDoc(roomDocRef, {
          count: increment(-1), // countを1減らす
        });
        console.log("Count decremented");
      } catch (error) {
        console.error("Error decrementing count: ", error);
      }
    }
  }, [roomId]);

  // game-startから戻ってきた場合にcountとmembersを比較してロード終了
  const checkCompletion = useCallback(async () => {
    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(roomDocRef);
      if (docSnap.exists()) {
        const roomData = docSnap.data();
        const members = roomData.members.length; // membersの数を取得
        const currentCount = roomData.count; // countを取得

        if (members === currentCount) {
          // countとmembersが同じ場合、ロードを終了する
          handleCompletion();
        }
      }
    }
  }, [roomId]);

  // 画面遷移元に応じてメッセージを設定
  useEffect(() => {
    const from = location.state?.from;

    if (from === "create-room") {
      setMessage("CreateRoom");
    } else if (from === "game-start") {
      setMessage("GameStart");
      checkCompletion(); // game-startから来た時にcountとmembersの数を比較する
    } else if (from === "CollagePage") {
      setMessage("CollagePage"); // CollagePageから来た場合
      decrementCount(); // CollagePageから来た時にcountを1減らす
    } else {
      setMessage("Toppage");
    }
  }, [location.state, decrementCount, checkCompletion]);

  // roomIdを取得
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomIdFromQuery = params.get("roomId");

    if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
    }
  }, [location.search]);

  // Firestoreからroomのtitleとcountを取得し、countが0になったらロードを終了
  useEffect(() => {
    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const fetchRoomData = async () => {
        try {
          const docSnap = await getDoc(roomDocRef);
          if (docSnap.exists()) {
            const roomData = docSnap.data();
            setRoomTitle(roomData.roomName || "No Title");
            setCount(roomData.count || 0); // count値を取得
            if (roomData.count === 0) {
              // countが0になったらロード終了処理
              handleCompletion();
            }
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching room data: ", error);
        }
      };

      fetchRoomData();
    }
  }, [roomId]);

  // ロードが完了したら次の処理に進む
  const handleCompletion = () => {
    console.log("ロードが完了しました");
    // ここにロード終了後の処理を追加する（例: 次のページに遷移するなど）
  };

  // メンバーのIDをroomsコレクションに追加
  useEffect(() => {
    if (roomId && userId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const addUserToRoom = async () => {
        try {
          await updateDoc(roomDocRef, {
            members: arrayUnion(userId),
          });
        } catch (error) {
          console.error("Error adding user to room: ", error);
        }
      };

      addUserToRoom();
    }
  }, [roomId, userId]);

  // メンバーの人数をリアルタイムで監視
  useEffect(() => {
    if (message === "CreateRoom" && roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const roomData = docSnapshot.data();
          const memberCount = Array.isArray(roomData.members)
            ? roomData.members.length
            : 0;
          setMemberCount(memberCount);
        }
      });

      return () => unsubscribe();
    }
  }, [roomId, message]);

  // Toppageのとき、isActiveの変化を監視して、trueになったらgame-startに遷移する処理
  useEffect(() => {
    if (message === "Toppage" && roomId) {
      const roomDocRef = doc(db, "rooms", roomId);

      const unsubscribe = onSnapshot(roomDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const roomData = docSnapshot.data();
          if (roomData.isActive) {
            navigate(`/game-start?roomId=${roomId}`, { state: { userId } });
          }
        }
      });

      return () => unsubscribe();
    }
  }, [roomId, message, navigate, userId]);

  // ホストが「はじめる」ボタンを押したときの処理
  const handleStartClick = async () => {
    if (memberCount <= 1) {
      // 参加人数が1人以下の場合、エラーメッセージを表示
      setErrorMessage("参加人数が1人のため、開始できません。");
      return;
    }

    if (roomId) {
      const roomDocRef = doc(db, "rooms", roomId);
      try {
        await updateDoc(roomDocRef, {
          isActive: true,
        });
        navigate(`/game-start?roomId=${roomId}`, { state: { userId } });
      } catch (error) {
        console.error("Error starting game: ", error);
      }
    }
  };

  return (
    <div className="waitroom">
      <div className="room-title">
        <h2 className="roomName">
          ルーム名
          <br />
          {roomTitle}
        </h2>
      </div>
      <div className="spinner-container">
        <Spinner />
      </div>

      {message === "Toppage" && (
        <h3>
          ホストが開始するまで
          <br />
          しばらくお待ちください
        </h3>
      )}

      {message === "CreateRoom" && (
        <>
          <h3>参加人数: {memberCount}人</h3>
          <div className="start-button">
            <Button onClick={handleStartClick}>
              はじめる
            </Button>
            {/* エラーメッセージを表示 */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </>
      )}

      {message === "GameStart" && (
        <div className="text">画像が出揃うまで少々お待ちください</div>
      )}

      {message === "CollagePage" && count !== null && (
        <div className="text">
          全員が揃うまで少々お待ちください
          <br />
          残り{count}人です
        </div>
      )}
    </div>
  );
};

export default WaitRoom;
