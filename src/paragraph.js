import React from 'react';
import '../styles.sass';

const Paragraph = props => (
  <div className="paragraph">
    {/* Number */}
    <h3 className="p-num" onClick={props.handleClick}>{props.parNum}</h3>
    {/* Textfield */}
    <div
      contentEditable
      type="text"
      id={`par${props.parNum}`}
      className="textarea"
      onKeyUp={(e) => props.keyUpUpdate(e,1)}
      onKeyDown={props.keyDownUpdate}
    >{props.text}</div>
  </div>
);


export default Paragraph;
