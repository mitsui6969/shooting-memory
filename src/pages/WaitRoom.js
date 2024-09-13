import React, { useState, useEffect } from "react";
import "../App.css";
import "../styles/WaitRoom.css";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner/Spinner";
import Button from "../components/Button_orange/Button_orange";
import { db } from '../firebase/firebase-app';
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; // Firestoreのメソッドをインポート

const WaitRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 最初はロード状態
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState(null); // roomIdの状態を追加
  const [userId, setUserId] = useState(""); // ユーザーIDを保持する状態
  const [memberCount, setMemberCount] = useState(0); // メンバー数を保持
  const [count, setCount] = useState(0); // countを保持

  // location.state から roomId と from を取得
  const { from } = location.state || {};

  // ページ遷移時に持ってきた値が"game-start"ならmessageを更新
  useEffect(() => {
    if (location.state?.from === "game-start") {
      setMessage("game-start");
    } else {
      setMessage("CreateRoom");
    }
  }, [location.state]);

  useEffect(() => {
    const stateRoomId = location.state?.roomId;
    if (stateRoomId) {
      setRoomId(stateRoomId); // roomIdを保存
    } else {
      const params = new URLSearchParams(location.search);
      const roomIdFromQuery = params.get("roomId");
      setRoomId(roomIdFromQuery); // クエリパラメータから roomId を取得
      if (roomIdFromQuery) {
        setMessage("Toppage");
      } else {
        setMessage("CreateRoom");
      }
    }
  }, [location.state, location.search]);

  // IDが取得できなかった場合に仮のIDを発行
  useEffect(() => {
    if (!location.state || !location.state.id) {
      // 仮IDを発行
      const temporaryId = `guest_${Math.random().toString(36).substring(2, 15)}`;
      setUserId(temporaryId);
      console.log("仮IDが発行されました:", temporaryId);
    } else {
      // 正常なIDが存在する場合、それを使用
      setUserId(location.state.id);
    }
  }, [location.state]);

  // FirestoreのGameStatus、count、メンバー数が変更されるまで監視
  useEffect(() => {
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);

      // FirestoreからリアルタイムでGameStatus, count, membersを監視
      const unsubscribe = onSnapshot(roomRef, async (doc) => {
        const data = doc.data();
        if (data) {
          console.log("GameStatus:", data.GameStatus);
          if (data.members) {
            setMemberCount(data.members.length); // メンバー数を更新
          }
          if (data.count) {
            setCount(data.count); // countを更新
          }

          // messageが"game-start"で、countとmembersの長さに1を足した数が一致する場合
          if (message !== "CreateRoom" && data.count === (data.members.length + 1)) {
            setLoading(false); // ロードを解除
          } else if (data.GameStatus === "start") {
            setLoading(false); // GameStatusがstartになったらロードを解除
          }
        }
      });

      return () => unsubscribe(); // コンポーネントがアンマウントされたときにリスナーを解除
    }
  }, [roomId, message]);

  // メッセージが"Toppage"の時に、自分のidをFirestoreに追加
  useEffect(() => {
    const addMemberToRoom = async () => {
      if (message === "Toppage" && roomId && userId) {
        const roomRef = doc(db, "rooms", roomId); // Firestoreの部屋ドキュメントを参照

        try {
          // membersフィールドに自分のidを追加
          await updateDoc(roomRef, {
            members: arrayUnion(userId)
          });
          console.log("メンバーが追加されました:", userId);
        } catch (error) {
          console.error("メンバーの追加に失敗しました:", error);
        }
      }
    };

    addMemberToRoom();
  }, [message, roomId, userId]);

  // FirestoreのGameStatusをstartに更新する関数
  const updateGameStatusToStart = async () => {
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);
      try {
        await updateDoc(roomRef, {
          GameStatus: "start" // GameStatusをstartに更新
        });
        console.log("GameStatusがstartに更新されました");
      } catch (error) {
        console.error("GameStatusの更新に失敗しました:", error);
      }
    }
  };

  // 「はじめる」ボタンがクリックされたときに、ロードを解除してGameStatusをstartに更新
  const handleStartClick = async () => {
    await updateGameStatusToStart(); // GameStatusをstartに更新
    setLoading(false); // ボタンが押されたらロードを終了し、遷移
  };

  // ロードが終わったら /game-start に遷移し、GameStatusをwaitに更新
  useEffect(() => {
    const navigateWithWaitStatus = async () => {
      // FirestoreのGameStatusをwaitに更新する関数
      const updateGameStatusToWait = async () => {
        if (roomId) {
          const roomRef = doc(db, "rooms", roomId);
          try {
            await updateDoc(roomRef, {
              GameStatus: "wait" // GameStatusをwaitに更新
            });
            console.log("GameStatusがwaitに更新されました");
          } catch (error) {
            console.error("GameStatusの更新に失敗しました:", error);
          }
        }
      };

      await updateGameStatusToWait(); // GameStatusをwaitに更新
      navigate('/game-start', { state: { roomId } }); // ロードが完了したらroomIdを一緒に遷移
    };

    if (!loading && from !== "game-start") {
      navigateWithWaitStatus(); // ロードが完了したらwaitに更新してgame-startに遷移
    }
  }, [loading, navigate, roomId, from]);

  const remainingPeople = memberCount + 1 - count; // 残りの人数を計算

  // remainingPeopleが0になったら/shooting-screenに移動
  useEffect(() => {
    if (message === "game-start" && remainingPeople === 0) {
      navigate('/shooting-screen', { state: { roomId } });
    }
  }, [remainingPeople, message, navigate, roomId]);

  return (
    <div className="waitroom">
      {loading ? (
        <div className="spinner-container">
          <Spinner /> {/* ローディング中はスピナーを表示 */}
        </div>
      ) : (
        <h1>コンテンツが読み込まれました！</h1>
      )}

      {/* 条件分岐を1つだけ表示 */}
      {loading && (
        from === "game-start" ? (
          <div className="text">画像が出揃うまで少々お待ちください。残り{remainingPeople}人</div>
        ) : message === "Toppage" ? (
          <div className="text">ホストが開始するまでしばらくお待ちください</div>
        ) : message === "CreateRoom" && (
          <>
            <div className="text-host">参加人数{memberCount}人</div> {/* メンバー数を表示 */}
            <div className="start-button">
              <Button onClick={handleStartClick}>はじめる</Button> {/* ボタンがクリックされるまでロード */}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default WaitRoom;
