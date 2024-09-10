import React, { useState } from 'react';
import styles from './Frame.module.css';
import defaultBackImage from"../../assets/plus-icon.png"

export default function Frame({ imageCount, title, date, selectColor, selectBorder, selectTitle }) {

    imageCount = 4
    title = "タイトル"
    date = "yyyy/mm/dd"
    selectColor = "white" // white/black/blue //
    selectBorder = 0 // 1(on)/0(of) //
    selectTitle = 1 // 1(on)/0(of) //
    const [imageList, setImageList] = useState(Array.from({ length: imageCount }));

    const getLayoutClass = () => {
        switch (imageCount) {
        case 2:
            return styles.twoImages;
        case 3:
            return styles.threeImages;
        case 4:
            return styles.fourImages;
        default:
            return '';
        }
    };

    const getBackgroundColor = () => {
        switch (selectColor) {
            case "white":
                return styles.white;
            case "black":
                return styles.black;
            case "blue":
                return styles.blue;
            default:
                return "white"
        }
    }

    const getBorder = () => {
        if (selectBorder===1){
            return styles.frameBorder
        }
    }

    const getOverlay = () => {
        if (selectTitle===0) {
            return styles.hiddenTitle
        }
    }

    //画像入れ替え
    const handleImage = () => {

    }

    return (
        <div className={`${styles.collage} ${getLayoutClass()} ${getBackgroundColor()} ${getBorder()}`}>
            {imageList.map((_, index) => (
                <div key={index} className={styles.imageContainer}>                    
                    <img
                        src={defaultBackImage} // デフォルト画像を設定
                        alt={`Collage image ${index + 1}`}
                        className={styles.image}
                    />                    
                </div>
            ))}

            <div className={`${styles.overlay} ${getBackgroundColor()} ${getOverlay()}`}>
                <div className={styles.texts}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.date}>{date}</p>
                </div>
            </div>
        </div>
    );
}