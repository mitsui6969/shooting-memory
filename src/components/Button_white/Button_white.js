
import React from 'react';
import './Button_white.css'; // 外部CSSファイルをインポート

const Button = ({ children, ...rest }) => {
    return (
        <button className="button-white" {...rest}>
            {children}
        </button>
    )
}

export default Button;