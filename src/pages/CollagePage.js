import React, { useState } from "react";
import Frame from "../components/Frame/Frame";
import "../styles/CollagePage.css";
import testImage from "../assets/image/toppage-background.jpeg";
import testImage2 from "../assets/image/bear.png"
import testImage3 from "../assets/image/usagi.png"
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from "../components/Button_orange/Button_orange";

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

  const removeImage = (index) => {
    setDraggedImages((prevDraggedImages) => [...prevDraggedImages, index])
  };

  const handleCompletion = () => {
    // navigate('/');
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
    </div>
  );
};

export default CollagePage;