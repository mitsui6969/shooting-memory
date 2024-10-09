import React, { useState } from 'react';
import "../App.css";
import "../styles/GameStart.css";
import Button from '../components/Button_orange/Button_orange';
import { useNavigate } from 'react-router-dom';
import Images from "../assets/image/images.png";
import { storage } from '../firebase/firebase-app';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from '../firebase/firebase-app';
import { useLocation } from 'react-router-dom';

const GameStart = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [name, setName] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);

  // クエリパラメータからroomIdを取得
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('roomId');

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedImages.length > 2) {
      setError("画像は2枚まで選択できます。");
      return;
    }
    setError("");
    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 2));
    setUploadProgress(Array(files.length).fill(0));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("名前を入力してください。");
      return;
    }
    if (!roomId) {
      setError("Room ID が見つかりません");
      return;
    }
    if (selectedImages.length === 0) {
      setError("画像を最低1枚アップロードしてください。");
      return;
    }
    setError("");
    const docRef = doc(db, "selected_images", roomId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { photos: [] });
    }
    if (selectedImages.length > 0) {
      const imageUrls = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        try {
          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(prevProgress => {
                  const newProgress = [...prevProgress];
                  newProgress[i] = progress;
                  return newProgress;
                });
              },
              (error) => {
                setError(`画像 ${i + 1} のアップロードに失敗しました。`);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                imageUrls.push(downloadURL);
                try {
                  await updateDoc(docRef, {
                    photos: arrayUnion(downloadURL),
                  });
                  resolve();
                } catch (error) {
                  setError("画像のURLの保存に失敗しました。");
                  reject(error);
                }
              }
            );
          });
        } catch (error) {
          return;
        }
      }
    }
    const roomDocRef = doc(db, "rooms", roomId);
    try {
      await updateDoc(roomDocRef, {
        count: increment(1)
      });
    } catch (error) {
      setError("ルーム情報の更新に失敗しました。");
    }
    navigate('/wait-room', { state: { roomId, from: 'game-start' } });
  };

  return (
    <div className='gamestart'>
      <div className='text-base name'>名前</div>
      <div className='text-base select'>最大2枚の画像を選択してください</div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className='input-name'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力"
        />

        <div className="image-uploader">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            <div className="image-container">
              {selectedImages.length === 0 ? (
                <img src={Images} alt="Upload" className="image-default" style={{ margin: 'auto', display: 'block' }} />
              ) : (
                <>
                  {selectedImages[0] && (
                    <div className="image-wrapper">
                      <img src={URL.createObjectURL(selectedImages[0])} alt="Selected 1" className="image-left" />
                      <button type="button" className="remove-button" onClick={() => handleRemoveImage(0)}>×</button>
                    </div>
                  )}
                  {selectedImages[1] && (
                    <div className="image-wrapper">
                      <img src={URL.createObjectURL(selectedImages[1])} alt="Selected 2" className="image-right" />
                      <button type="button" className="remove-button" onClick={() => handleRemoveImage(1)}>×</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </label>
        </div>

        {/* 独立した進捗バー */}
        {uploadProgress.length > 0 && (
          <div className="progress-container">
            {uploadProgress.map((progress, index) => (
              <div key={index} className="progress-bar" style={{ width: `${progress}%` }}>
                {/* progressの値は表示せず、バーのみ表示 */}
              </div>
            ))}
          </div>
        )}

        <div className='start-button'>
          <Button type="submit">完了</Button>
        </div>
      </form>
    </div>
  );
};

export default GameStart;
