import React from 'react';

const Button = props => {
    return (
        <button id={props.id} onClick={props.onClick} height={props.height} width={props.width}>
            {props.buttonLabel}
        </button>
    );
};

export default Button;