import React from 'react';

const BasicButton = <T extends unknown>({
    buttonText,
    buttonColor,
    textColor,
    onClick,
    customStyle,
    value,
}: BasicButtonProps<T>) => {

    return(
        <button 
            className={`px-2 py-2 rounded-lg bg-${buttonColor} text-${textColor} ${customStyle}`}
            onClick={
                () => {
                    if(value) onClick(value);
                    else onClick();
                }
            }
        >
            {buttonText}
        </button>
    );
};

export default BasicButton;