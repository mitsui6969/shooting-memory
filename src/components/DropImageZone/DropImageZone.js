import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import './DropImagezone.css'
import plusIcon from '../../assets/plus-icon.png'

const DropImageZone = () => {
    const [file, setFile] = useState(null);

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

    const dropAreaBackground = isDragActive ? 'gray' : '';

    const filePreview = useMemo(() => {
        if (!file) {
            return null;
        }

        const url = URL.createObjectURL(file);

        return <img src={url} alt="Preview" className="file-preview" />;
    }, [file]);

    return (
        <div className="image-upload-container">
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
                        {/* ドラッグ＆ドロップのみでアップロード */}
                        <input {...getInputProps()} />
                        <img src={plusIcon} className='plus-icon' />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropImageZone;
