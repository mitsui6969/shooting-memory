import React, { useState } from "react";
import Frame from "../components/Frame/Frame";
import "../styles/CollagePage.css";
import testImage from "../assets/image/toppage-background.jpeg";
import testImage2 from "../assets/image/bear.png"
import testImage3 from "../assets/image/usagi.png"
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from "../components/Button_orange/Button_orange";
import html2canvas from "html2canvas";

const DraggableImage = ({ src, index, removeImage, isDragged }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
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
  }), [index, removeImage]);

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

const CollagePage = ({images, title="title", date="yyyy/mm/dd", selectColor=0, selectBorder=true}) => {
  images = [testImage, testImage2, testImage3];
  const [draggedImages, setDraggedImages] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [isModal, setIsModal] = useState(false);

  const removeImage = (index) => {
    setDraggedImages((prevDraggedImages) => [...prevDraggedImages, index])
  };

  const handleCompletion = () => {
    const target = document.getElementById('target-to-image')
    html2canvas(target, { scale:5, width:target.clientWidth, height:target.clientHeight, backgroundColor: null }).then((canvas) => {
      // キャンバスをPNG形式のデータURLに変換
      const targetImgUri = canvas.toDataURL("image/png");
      setImageSrc(targetImgUri)
      setIsModal(true)
    });
  }

  const handleModalClose = () => {
    setIsModal(false);
  }


  return (
    <div className="collagePage">
    <DndProvider backend={HTML5Backend}>
      <div className="frameArea">
        <Frame
          imageCount={images.length}
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
    <Button onClick={handleCompletion}>完成！</Button>
    </div>

    {isModal && (
      <div className="complet-modal">
        <img src={imageSrc} className="collage-image"/>
        <button onClick={handleModalClose}>close</button>
      </div>
    )}
    </div>
  );
};

export default CollagePage;