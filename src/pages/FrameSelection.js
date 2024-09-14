import React, { useState, useEffect } from 'react';
import '../styles/FrameSelection.css';
import Button from "../components/Button_orange/Button_orange";
import Frame from "../components/Frame/Frame";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // DndProviderのインポート
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase-app';


const FrameSelection = () => {
    // チェックボックスの状態を個別に管理
    const [isFrameChecked, setIsFrameChecked] = useState(false);
    const [isTitleChecked, setIsTitleChecked] = useState(false);
    const [isDayChecked, setIsDayChecked] = useState(true);
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectColor, setSelectColor] = useState(0);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    // セレクトボックスの選択値に応じて selectColor を変更
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);

        // 色選択
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
    const frameTitle = isTitleChecked ? title : ""; // タイトルチェックボックスの状態により内容を切り替え
    // 日付の中身を動的に切り替える
    const frameDate = isDayChecked ? date : ""; // 日付チェックボックスの状態により内容を切り替え

    // db処理
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const roomID = "testRoom";
                const roomDocRef = doc(db, "rooms", roomID);
                const roomDoc = await getDoc(roomDocRef);
                
                if (roomDoc.exists()) {
                const data = roomDoc.data();
                setTitle(data.roomName || '');

                
                if (data.createdAt && data.createdAt.toDate) {
                    setDate(data.createdAt.toDate().toLocaleDateString());
                } else {
                    setDate(data.createdAt || '');
                }
                
                
                } else {
                console.log("ドキュメントが存在しません！");
                }
            } catch (error) {
                console.error("ルームデータの取得中にエラーが発生しました: ", error);
            }
        };
    
        fetchRoomData();
    }, []);


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
                <label htmlFor="image-options">フレームの色を選択してください：</label>
                <select 
                    id="image-options" 
                    value={selectedOption} 
                    onChange={handleSelectChange} // セレクトボックスの変更時に handleSelectChange を呼ぶ
                    className="select-box"
                >
                    <option value="option1">白(ノーマル)</option>
                    <option value="option2">黒(ノーマル)</option>
                    <option value="option3">Blue</option>
                    <option value="option4">White</option>
                    <option value="option5">Black</option>
                </select>
            </div>

            {/* 灰色の四角形を追加 */}
            <div className="gray-square"></div>
        </div>
    );
};

export default FrameSelection;
