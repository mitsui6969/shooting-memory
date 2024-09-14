import React, { useState } from 'react';
import styles from './Frame.module.css';
import DropImageZone from '../DropImageZone/DropImageZone';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Frame({ imageCount, title, date, selectColor, selectBorder }) {

    // title = "タイトル" // 20文字まで
    // date = "yyyy/mm/dd"
    // selectColor = 4 // 0.white/1.black/2.blue/3.white2p/4.black2p //
    // selectBorder = 1 // 1(on)/0(of) //

    const [imageList, setImageList] = useState(Array.from({ length: imageCount }, () => null));

    // 画像ドロップしたとき
    const handleDropImage = (index, newImage) => {
        setImageList((previewList) => {
            const newList = [...previewList];
            newList[index] = newImage;
            return newList;
        })
    }

    //画像入れ替え
    const swapImage = ( fromIndex, toIndex ) => {
        setImageList((imageList) => {
            const newList = [...imageList];
            [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];
            return newList;
        });
    };

    // 画像枚数によるレイアウト
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

    // 背景選択
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

    // 枠ありなし
    const getBorder = () => selectBorder ? styles.frameBorder : '';

    // タイトル日付ありなし
    const getOverlay = (title, date) => {
        return title || date ?  '' : styles.hiddenTitle
    }

    return (
        <div id='target-to-image' className={`${styles.collage} ${getLayoutClass()} ${getBackgroundColor()} ${getBorder()}`}>
            {imageList.map((src, index) => (
                <div key={index} className={styles.imageContainer}>                    
                    <DropImageZone
                        image = {src}
                        onDrop={(newImage) => handleDropImage(index, newImage)}
                        swapImage={(fromIndex, toIndex) => swapImage(fromIndex, toIndex)}
                        index={index}
                    />
                </div>
            ))}

            <div className={`${styles.overlay} ${getBackgroundColor()} ${getOverlay(title, date)}`}>
                <div className={styles.texts}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.date}>{date}</p>
                </div>
            </div>
        </div>
    );
}