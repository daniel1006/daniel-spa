import React from 'react';

import './MessageBox.css';

function MessageBox(props) {
    const classes = `Message${props.error ? ' Error' : ''}`; 
    return <div className={classes}>{props.message}</div>;
}

export default MessageBox;
