import React, { useState } from 'react';
import styles from './Frame.module.css';
import defaultBackImage from"../../assets/image/plus-icon.png"
import DropImageZone from '../DropImageZone/DropImageZone';

export default function Frame({ imageCount, title, date, selectColor, selectBorder, selectTitle }) {

    imageCount = 4
    title = "タイトル"
    date = "yyyy/mm/dd"
    selectColor = 4 // 0.white/1.black/2.blue/3.white2p/4.black2p //
    selectBorder = 1 // 1(on)/0(of) //
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
            case 0:
                return styles.white;
            case 1:
                return styles.black;
            case 2:
                return styles.blue;
            case 3:
                return styles.white2p;
            case 4:
                return styles.black2p;
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
                    {/* <img
                        src={defaultBackImage} // デフォルト画像を設定
                        alt={`Collage image ${index + 1}`}
                        className={styles.image}
                    />                     */}
                    <DropImageZone/>
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
