import React from 'react';

import './MessageBox.css';

function MessageBox(props) {
    const classes = `Message${props.error ? ' Error' : ''}`; // So I thought I knew how this worked but I'm quite lost. 
                                                             //From what I understand about props this is a child component that is defined (or rendered) in app.js. But I don't get where ´Message` comes from or what it does. 
                                                             //From what I could tell Message was also assigned as a property. So where and how is props being used?
    return <div className={classes}>{props.message}</div>;
}

export default MessageBox;
