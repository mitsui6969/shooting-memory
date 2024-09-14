import React, { useState } from 'react';
import '../styles/FrameSelection.css';
import Button from "../components/Button_orange/Button_orange";
import Frame from "../components/Frame/Frame";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // DndProviderのインポート

const FrameSelection = () => {
    // チェックボックスの状態を個別に管理
    const [isFrameChecked, setIsFrameChecked] = useState(false);
    const [isTitleChecked, setIsTitleChecked] = useState(false);
    const [isDayChecked, setIsDayChecked] = useState(true); // 日付のチェックボックスを管理
    const [selectedOption, setSelectedOption] = useState('option1'); // セレクトボックスの選択値を管理
    const [selectColor, setSelectColor] = useState(0); // Frame の selectColor を管理

    // セレクトボックスの選択値に応じて selectColor を変更
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);

        // セレクトボックスの値に基づいて selectColor を設定
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

    // タイトルの中身を動的に切り替える
    const frameTitle = isTitleChecked ? "タイトル" : ""; // タイトルチェックボックスの状態により内容を切り替え
    // 日付の中身を動的に切り替える
    const frameDate = isDayChecked ? "2024/09/14" : ""; // 日付チェックボックスの状態により内容を切り替え

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
            
            <div className='next-button'>
                <Button>次へ</Button>
            </div>

            {/* DndProviderを使用してFrameをラップ */}
            <DndProvider backend={HTML5Backend}>
                <div className='frame-change'>
                    <Frame
                        imageCount={2} 
                        title={frameTitle}  // チェックボックスによってタイトルを動的に変更
                        date={frameDate}    // チェックボックスによって日付を動的に変更
                        selectColor={selectColor}  // 動的に変更される selectColor
                        selectBorder={isFrameChecked} // チェックボックスの状態で selectBorder を切り替え
                    />
                </div>
            </DndProvider>

            <div className="image-checkbox-container">
                {/* チェックボックスを個別に表示 */}
                <label className="checkbox-label">
                    <input 
                        type="checkbox" 
                        checked={isFrameChecked} 
                        onChange={() => setIsFrameChecked(!isFrameChecked)}  // チェック時にステートを更新
                        className="checkbox-frame"
                    />
                    <input 
                        type="checkbox" 
                        checked={isTitleChecked} 
                        onChange={() => setIsTitleChecked(!isTitleChecked)}  // タイトルのチェックボックスでタイトルの表示を切り替える
                        className="checkbox-title"
                    />
                    <input 
                        type="checkbox" 
                        checked={isDayChecked} 
                        onChange={() => setIsDayChecked(!isDayChecked)}  // 日付のチェックボックスで日付の表示を切り替える
                        className="checkbox-day"
                    />
                </label>
            </div>

            {/* セレクトボックスを追加 */}
            <div className="select-box-container">
                <label htmlFor="image-options">背景の色を選択してください：</label>
                <select 
                    id="image-options" 
                    value={selectedOption} 
                    onChange={handleSelectChange} // セレクトボックスの変更時に handleSelectChange を呼ぶ
                    className="select-box"
                >
                    <option value="option1">白1</option>
                    <option value="option2">黒1</option>
                    <option value="option3">青</option>
                    <option value="option4">白2</option>
                    <option value="option5">黒2</option>
                </select>
            </div>

            {/* 灰色の四角形を追加 */}
            <div className="gray-square"></div>
        </div>
    );
};

export default FrameSelection;
