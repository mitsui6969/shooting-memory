import React, { useState } from 'react';
import styles from './Frame.module.css';
import defaultBackImage from"../../assets/プラスのアイコン素材.png"

export default function Frame({ imageCount, title, date, selectColor }) {

    imageCount = 2
    title = "感謝感激あめあられ"
    date = "2044/04/04"
    selectColor = "white"
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

    //画像入れ替え
    const handleImage = () => {

    }

    return (
        <div className={`${styles.collage} ${getLayoutClass()} ${getBackgroundColor()}`}>
            {imageList.map((_, index) => (
                <div key={index} className={styles.imageContainer}>                    
                    <img
                        src={defaultBackImage} // デフォルト画像を設定
                        alt={`Collage image ${index + 1}`}
                        className={styles.image}
                    />                    
                </div>
            ))}

            <div className={`${styles.overlay} ${getBackgroundColor()}`}>
                <div className={styles.texts}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.date}>{date}</p>
                </div>
            </div>
        </div>
    );
}