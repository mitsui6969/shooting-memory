
import React from 'react';
import './Button.css'; // 外部CSSファイルをインポート

const Button = ({ children, ...rest }) => {
    return (
        <button className="button-common" {...rest}>
            {children}
        </button>
    )
}

export default Button;