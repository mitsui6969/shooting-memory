import React from 'react';
import './Button.css'; // 外部CSSファイルをインポート

const Button = ({ children, ...rest }) => {
    return (
        <button className="custom-button" {...rest}>
            {children}
        </button>
    )
}

export default Button;