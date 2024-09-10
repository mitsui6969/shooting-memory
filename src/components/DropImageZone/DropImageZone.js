import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const DropImageZone = () => {
    const [file, setFile] = React.useState(null);

    const onDrop = useCallback((files) => {
        if (files.length > 0) {
            setFile(files[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg'],
        },
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
                filePreview
            ) : (
                <div className="file_plus">
                    <p>画像アップロード</p>
                    <div {...getRootProps()} className={`drop-area ${dropAreaBackground}`}>
                        <input {...getInputProps()} />
                        <p>
                            ファイルを選択または
                            <br />
                            ドラッグアンドドロップ
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropImageZone;
