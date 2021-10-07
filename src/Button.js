import React from 'react';

const Button = props => {
    return (
        <button id={props.id} onClick={props.onClick} style={props.style}>
            {props.buttonLabel}
        </button>
    );
};

export default Button;