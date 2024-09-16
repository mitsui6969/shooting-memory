import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Frame from "../components/Frame/Frame";
import "../styles/CollagePage.css";
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ButtonO from "../components/Button_orange/Button_orange";
import ButtonW from "../components/Button_white/Button_white";
import html2canvas from "html2canvas";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase-app";
import { getStorage, getDownloadURL, ref, uploadString } from "firebase/storage";

const DraggableImage = ({ src, index, removeImage, isDragged }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { src },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          removeImage(index);
        }
      },
    }),
    [index, removeImage]
  );

  return (
    <li
      ref={drag}
      key={index}
      className={`imageContainer ${isDragging || isDragged ? "dragging" : ""}`}
      style={{ opacity: isDragging || isDragged ? 0.5 : 1 }}
    >
      <img src={src} alt={`Collage ${index + 1}`} className="image" />
    </li>
  );
};

const CollagePage = () => {
  const location = useLocation();
  const { title, date, selectColor, selectBorder, userId, numImages } = location.state
  console.log("location.stateの値:", location.state)

  // roomIdを取得
  const [roomId, setRoomId] = useState('')
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const roomIdFromQuery = params.get("roomId");

      if (roomIdFromQuery) {
      setRoomId(roomIdFromQuery);
      }
  }, [location.search]);;


  const [images, setImages] = useState([]);

  const [draggedImages, setDraggedImages] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const navigate = useNavigate();

  const removeImage = (index) => {
    setDraggedImages((prevDraggedImages) => [...prevDraggedImages, index])
  };

  // 射的した画像取得
  const fetchSelectedImages = async () => {
    try {

      const selectedImagesDocRef = doc(db, "selected_images", roomId );
      const selectedImagesDoc = await getDoc(selectedImagesDocRef);
  
      if (selectedImagesDoc.exists()) {
        const data = selectedImagesDoc.data();
        const photos = data.photos || [];
  
        return photos;
      } else {
        console.log("No such document!");
        return [];
      }

    } catch (e) {
      console.error("Error fetching selected images: ", e);
      return [];
    }
  };

  // 画像化
  const handleCompletion = () => {
    const target = document.getElementById("target-to-image");
    html2canvas(target, {
      scale: 5,
      width: target.clientWidth,
      height: target.clientHeight,
      backgroundColor: null,
    }).then((canvas) => {
      const targetImgUri = canvas.toDataURL("image/png");
      setImageSrc(targetImgUri);
      setIsModal(true);
    });
  };

  // 出揃い画面にgo
  const handletoEditFinPage = async () => {

    if (!userId || !roomId) {
      console.error("userID または roomID が無効です");
      // return;
    }

    navigate(`/edit-fin?roomId=${roomId}`);
    await DBtoCollageImage(roomId, userId, imageSrc);
    }

  const handleModalClose = () => {
    setIsModal(false);
  };

  // db処理
  const DBtoCollageImage = async (roomId, userId, collageImageUrl) => {
    try{
      // storageに保存
      const storage = getStorage();
      const storageRef = ref(storage, `collages/${roomId}/${userId}.png`);

      await uploadString(storageRef, collageImageUrl, "data_url");
      const downloadURL = await getDownloadURL(storageRef);

      // コレクション追加
      const participantDocRef = doc(db, "rooms", roomId, "participants", userId);
      await updateDoc(participantDocRef, {
        collageImage: downloadURL,
      });

      const roomDocRef = doc(db, "rooms", roomId);
      await updateDoc(roomDocRef, {
        collagedImageList: arrayUnion(downloadURL),
      });

      console.log("collageImage successfully added or updated!");
    } catch (e) {
      console.error("Error adding collageImage: ", e);
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = await fetchSelectedImages(roomId);
      setImages(fetchedImages);
    };

    fetchImages();
  }, [roomId]);


  return (
    <div className="collagePage">
    <DndProvider backend={HTML5Backend}>
      <div className="frameArea">
        <Frame
          imageCount={numImages}
          title={title}
          date={date}
          selectColor={selectColor}
          selectBorder={selectBorder}
          id="target-to-image"
        />
      </div>

        <div className="imagesArea">
          <ul className="imagesArray">
            {images.map((src, index) => (
              <DraggableImage
                key={index}
                src={src}
                index={index}
                removeImage={removeImage}
                isDragging={draggedImages.includes(index)}
              />
            ))}
          </ul>
        </div>
      </DndProvider>
      <div className="completionButton">
        <ButtonO onClick={handleCompletion}>完成！</ButtonO>
      </div>

      {isModal && (
        <div className="complet-modal">
          <div className="modal-button-container">
            <img src={imageSrc} alt="Collage result" className="collage-image" />

            <div className="button-container">
              <div className="button-modal go-white">
                <ButtonW onClick={handleModalClose}>編集を続ける</ButtonW>
              </div>

              <div className="button-modal go-orange">
                <ButtonO onClick={handletoEditFinPage}>次へ</ButtonO>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollagePage;
