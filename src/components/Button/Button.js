import React from 'react';

const Button = ({ children, ...rest }) => {
    return (
        <button
            className="bg-transparent text-white h-full py-4 w-full px-6 text-md border-2 border-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-black active:bg-white/10 active:shadow-[0_5px_#666]"
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button