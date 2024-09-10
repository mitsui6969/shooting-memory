import React from 'react';
import './Button_orange.css'; // 外部CSSファイルをインポート

const Button = ({ children, ...rest }) => {
    return (
        <button className="button-orange" {...rest}>
            {children}
        </button>
    )
}

export default Button;

