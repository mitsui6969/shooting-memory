import React, { useNavigate } from 'react';
import './styles/FrameSelection.css'
import titleBorder from '../assets/layoutSanple/title-border.png'
import titleNone from '../assets/layoutSanple/title-none.png'
import noneBorder from '../assets/layoutSanple/none-border.png'
import noneNone from '../assets/layoutSanple/none-none.png'

const FrameSelection = () => {
    const layoutCatalog = [titleBorder, titleNone, noneBorder, noneNone]

    return (
        <div className='frame-selection'>
            <h2>フレームを選択してください</h2>
            <div className='frames'>
                <div>
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
