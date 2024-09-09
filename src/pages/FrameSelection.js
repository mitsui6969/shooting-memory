import React, { useState } from 'react';
import './styles/FrameSelection.css'

const FrameSelection = () => {
    const [selectedImages, setSelectedImages] = useState(['/src/assets/background-lantern.jpeg', '/src/assets/background.jpeg']);

    const handleInputFile = (e) => {
        const files = e.target.files;
        if (!files) {
            return;
        }

        // FileListのままだとforEachが使えないので配列に変換する
        const fileArray = Array.from(files);

        fileArray.forEach((file) => {
            // ファイルを読み込むためにFileReaderを利用する
            const reader = new FileReader();
            // ファイルの読み込みが完了したら、画像の配列に加える
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result !== "string") {
                    return;
                }
                // `setSelectedImages` を使用して画像を更新
                setSelectedImages((prevImages) => [...prevImages, result]);
            };
            // 画像ファイルをbase64形式で読み込む
            reader.readAsDataURL(file);
        });
    };

    return (
        <div>
            <h2>フレームを選択してください</h2>
            <div className='frames'>
                <div className='frame nomal'></div>
                <div className='frame onborder'></div>
                <div className='frame notitle'></div>
            </div>
        </div>
    );
};

export default FrameSelection;
