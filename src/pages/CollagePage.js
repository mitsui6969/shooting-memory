import React, { useState } from "react";
import Frame from "../components/Frame/Frame";
import "../styles/CollagePage.css";
import testImage from "../assets/image/toppage-background.jpeg";
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableImage = ({ src, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",  // ここをドロップターゲットと同じにする
    item: { src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      key={index}
      className="imageContainer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={src} alt={`Collage image ${index + 1}`} className="image" />
    </li>
  );
};

const CollagePage = () => {
  const [images, setImages] = useState([testImage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="collagePage">
        <h2>collage page</h2>

        <div className="frameArea">
          <Frame />
        </div>

        <div className="imagesArea">
          <ul className="imagesArray">
            {images.map((src, index) => (
              <DraggableImage key={index} src={src} index={index} className='imag' />
            ))}
          </ul>
        </div>
      </div>
    </DndProvider>
  );
};

export default CollagePage;