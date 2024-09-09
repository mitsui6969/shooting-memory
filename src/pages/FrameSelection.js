import React, { useState } from 'react';
import './styles/FrameSelection.css'

const FrameSelection = () => {

    return (
        <div className='frame-selection'>
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
