import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import './DropImagezone.css';
import plusIcon from '../../assets/image/plus-icon.png';

const DropImageZone = ({ image, onDrop, swapImage, index }) => {
    const [file, setFile] = useState(null);

    // ドロップ機能
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item) => {
            if (item.index !== undefined) {
                swapImage(item.index, index);
            } else {
                handleDrop([item.src]); 
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
    }), [index, swapImage]);

    // ドロップされた画像保持
    const handleDrop = useCallback((files) => {
        if (file || files.length === 1) {
            const newFile = files[0];
            setFile(newFile);
            onDrop(newFile);
        } else {
            console.error("No file だよ")
        }
    }, [onDrop]);

    // 許可するファイル指定
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg'],
        },
        noClick: true,
        multiple: false,
    });

    // ドロップ可能エリア上にある時
    const dropAreaBackground = isDragActive || isOver ? 'gray' : '';  

    // 画像表示
    const filePreview = useMemo(() => {
        if (file) {
            return (
                <img src={file} alt='collage image' className='frameInImage' />
            );
        }
        return (
            <img src={plusIcon} className='plus-icon' alt="Upload" />
        );
    }, [file]);

    return (
        <div ref={drop} className="image-upload-container">
            <div {...getRootProps()} className={`drop-area ${dropAreaBackground}`}>
                <input {...getInputProps()} />
                {filePreview}
            </div>
        </div>
    );
};

export default DropImageZone;