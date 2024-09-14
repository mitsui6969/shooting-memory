import React, { useState } from 'react';
import '../styles/FrameSelection.css';
import titleBorder1 from '../assets/layoutSample/none-border.png'; // 表示したい画像をインポート
import titleBorder2 from '../assets/layoutSample/none-none.png';   // 表示したい画像をインポート
import titleBorder3 from '../assets/layoutSample/title-border.png'; // 3枚目の画像をインポート
import titleBorder4 from "../assets/layoutSample/title-none.png";
import Button from "../components/Button_orange/Button_orange"

const FrameSelection = () => {
    // チェックボックスの状態を個別に管理
    const [isFrameChecked, setIsFrameChecked] = useState(false);
    const [isTitleChecked, setIsTitleChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('option1'); // セレクトボックスの選択値を管理

    // 画像を切り替えるロジック
    let displayedImage;
    if (isFrameChecked && isTitleChecked) {
        displayedImage = titleBorder3; // 両方のチェックボックスが押された場合
    } else if (isFrameChecked) {
        displayedImage = titleBorder1; // 1つ目（枠）のチェックボックスが押された場合
    } else if (isTitleChecked) {
        displayedImage = titleBorder4; // 2つ目（タイトル）のチェックボックスが押された場合
    } else {
        displayedImage = titleBorder2; // どちらも押されていない場合
    }

    // グレースケールまたは白黒反転のフィルターをセレクトボックスの値に応じて決定
    let imageStyle = {};
    if (selectedOption === 'option1') {
        imageStyle = { filter: 'grayscale(1)' };  // 黒が選択された場合はグレースケール
    } else if (selectedOption === 'option3') {
        imageStyle = { filter: 'grayscale(1) invert(1)' };  // 白が選択された場合はグレースケールかつ白黒反転
    }

    return (
        <div className='frame-selection'>
            <div className='positioned-text'>
                <h2>フレームを選択してください</h2>
            </div>
            <div className='text-base'>
        	    <div className='text-frame'>枠</div>
              <div className='text-title'>タイトル</div>
            </div>
						<div className='next-button'>
							<Button>次へ</Button>
						</div>

            <div className="image-checkbox-container">
                {/* 画像の表示 */}
                {displayedImage && (
                    <img 
                        src={displayedImage} 
                        alt="layout"
                        className='centered-image'
                        style={imageStyle}  // グレースケールまたは白黒反転を適用
                    />
                )}

                {/* チェックボックスを個別に表示 */}
                <label className="checkbox-label">
                    <input 
                        type="checkbox" 
                        checked={isFrameChecked} 
                        onChange={() => setIsFrameChecked(!isFrameChecked)} 
                        className="checkbox-frame"
                    />
                    <input 
                        type="checkbox" 
                        checked={isTitleChecked} 
                        onChange={() => setIsTitleChecked(!isTitleChecked)} 
                        className="checkbox-title"
                    />
                </label>
            </div>

            {/* セレクトボックスを追加 */}
            <div className="select-box-container">
                <label htmlFor="image-options"></label>
                <select 
                    id="image-options" 
                    value={selectedOption} 
                    onChange={(e) => setSelectedOption(e.target.value)} 
                    className="select-box"
                >
                    <option value="option1">黒</option>
                    <option value="option2">青</option>
                    <option value="option3">白</option>
                </select>
            </div>

						{/* 灰色の四角形を追加 */}
            <div className="gray-square"></div>
        </div>
    );
};

export default FrameSelection;
