import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDrop } from 'react-dnd';
import './DropImagezone.css';
import plusIcon from '../../assets/image/plus-icon.png';

const DropImageZone = () => {
    const [file, setFile] = useState(null);
    const [scale, setScale] = useState(1); // 画像のスケール
    const [position, setPosition] = useState({ x: 0, y: 0 }); // 画像の位置

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item) => setFile(item.src),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const onDrop = useCallback((files) => {
        if (files.length === 1) {
            const newFile = files[0];
            setFile(newFile); // 新しいファイルで既存のファイルを置き換える
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg'], // 許可されるファイルタイプ
        },
        noClick: true, // クリックでのファイル選択を無効にする
        multiple: false,
    });

    const dropAreaBackground = isDragActive || isOver ? 'gray' : '';  // ドロップエリアの色を変更

    // handleMouseDown関数の定義をuseMemoの上に移動
    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;

        const onMouseMove = (moveEvent) => {
            setPosition({
                x: moveEvent.clientX - startX,
                y: moveEvent.clientY - startY
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    // handleWheel関数の定義をuseMemoの上に移動
    const handleWheel = (e) => {
        e.preventDefault();
        setScale((prevScale) => Math.min(Math.max(prevScale + e.deltaY * -0.01, 0.5), 3));
    };

    const filePreview = useMemo(() => {
        if (!file) {
            return null;
        }

        const url = typeof file === 'string' ? file : URL.createObjectURL(file);

        return (
            <img
                src={url}
                alt="Preview"
                className="file-preview"
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                }}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
            />
        );
    }, [file, scale, position]);

    return (
        <div ref={drop} className="image-upload-container">
            {file ? (
                <div className="file-preview-container">
                    {filePreview}
                    <div {...getRootProps()} className={`drop-area ${dropAreaBackground}`}>
                        <input {...getInputProps()} />
                    </div>
                </div>
            ) : (
                <div className="file_plus">
                    <div {...getRootProps()} className={`drop-area ${dropAreaBackground}`}>
                        <input {...getInputProps()} />
                        <img src={plusIcon} className='plus-icon' alt="Upload" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropImageZone;
