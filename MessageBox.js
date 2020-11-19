import React from 'react';

import './MessageBox.css';

function MessageBox(props) {
    const classes = `Message${props.error ? ' Error' : ''}`; // I think the return function displays the actual message saying whether or not there is an error?
    return <div className={classes}>{props.message}</div>;
}

export default MessageBox;
