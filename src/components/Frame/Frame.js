import React from 'react';
import styles from './Frame.module.css';

export default function Frame({ images=[], title='', date='' }) {
    const imageCount = images.length;

    if (imageCount < 2 || imageCount > 4) {
        return <div className={styles.error}>Please provide 2-4 images for the collage.</div>;
    }

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

    return (
        <div className={`${styles.collage} ${getLayoutClass()}`}>
        {images.map((src, index) => (
            <div key={index} className={styles.imageContainer}>
            <img
                src={src}
                alt={`Collage image ${index + 1}`}
                className={styles.image}
            />
            {index === 0 && (
                <div className={styles.overlay}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.date}>{date}</p>
                </div>
                </div>
            )}
            </div>
        ))}
        </div>
    );
}