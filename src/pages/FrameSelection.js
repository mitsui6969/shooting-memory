import React, { useNavigate } from 'react';

import '../styles/FrameSelection.css'
import titleBorder from '../assets/layoutSample/title-border.png'
import titleNone from '../assets/layoutSample/title-none.png'
import noneBorder from '../assets/layoutSample/none-border.png'
import noneNone from '../assets/layoutSample/none-none.png'

const FrameSelection = () => {
    const layoutCatalog = [titleBorder, titleNone, noneBorder, noneNone]

    return (
        <div className='frame-selection'>
            <h2>フレームを選択してください</h2>
            <div className='selection-area'>
                <div className='frames'>
                    {layoutCatalog.map((src, index) => (
                        <div key={index} className='frame'>
                            <img
                                src={src}
                                alt='layout'
                                className='layout-sanple'
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default FrameSelection;