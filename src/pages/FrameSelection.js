import React, { useState } from 'react';
import '../styles/FrameSelection.css';
import Button from "../components/Button_orange/Button_orange";
import Frame from "../components/Frame/Frame";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

const FrameSelection = () => {
    const [isFrameChecked, setIsFrameChecked] = useState(false);
    const [isTitleChecked, setIsTitleChecked] = useState(false);
    const [isDayChecked, setIsDayChecked] = useState(true);
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectColor, setSelectColor] = useState(0);
    const navigate = useNavigate(); // useNavigateを使用

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        switch (e.target.value) {
            case 'option1':
                setSelectColor(0); // 白1
                break;
            case 'option2':
                setSelectColor(1); // 黒1
                break;
            case 'option3':
                setSelectColor(2); // 青
                break;
            case 'option4':
                setSelectColor(3); // 白2
                break;
            case 'option5':
                setSelectColor(4); // 黒2
                break;
            default:
                setSelectColor(0); // デフォルトは白1
                break;
        }
    };

    const frameTitle = isTitleChecked ? "タイトル" : "";
    const frameDate = isDayChecked ? "2024/09/14" : "";

    // 次へボタンを押した時にページを遷移する関数
    const handleNextClick = () => {
        navigate('/collage-page'); // 'nextpage'は遷移先のURLに変更
    };

    return (
        <div className='frame-selection'>
            <div className='positioned-text'>
                <h2>フレームを選択してください</h2>
            </div>
            
            <div className='text-base'>
                <div className='text-frame'>枠</div>
                <div className='text-title'>タイトル</div>
                <div className='text-day'>日付</div>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className='frame-change'>
                    <Frame
                        imageCount={2} 
                        title={frameTitle}
                        date={frameDate}
                        selectColor={selectColor}
                        selectBorder={isFrameChecked}
                    />
                </div>
            </DndProvider>

            <div className="image-checkbox-container">
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
                    <input 
                        type="checkbox" 
                        checked={isDayChecked} 
                        onChange={() => setIsDayChecked(!isDayChecked)} 
                        className="checkbox-day"
                    />
                </label>
            </div>

            <div className="select-box-container">
                <label htmlFor="image-options"></label>
                <select 
                    id="image-options" 
                    value={selectedOption} 
                    onChange={handleSelectChange}
                    className="select-box"
                >
                    <option value="option1">白1</option>
                    <option value="option2">黒1</option>
                    <option value="option3">青</option>
                    <option value="option4">白2</option>
                    <option value="option5">黒2</option>
                </select>
            </div>

            <div className="gray-square"></div>

            {/* 次へボタンを1つだけ表示 */}
            <div className='next-button-'>
                <Button onClick={handleNextClick}>次へ</Button> 
            </div>
        </div>
    );
};

export default FrameSelection;
