import React from 'react';
import '../styles.sass';

const Paragraph = props => (
  <div className="paragraph">
    {/* Number */}
    <h3 className="p-num" onClick={props.handleClick}>{props.par}</h3>
    {/* Textfield */}
    <div
      contentEditable
      type="text"
      id={`par${props.par}`}
      className="textarea"
      placeholder={`Paragraph ${props.par}`}
      onKeyUp={(e) => props.keyUpUpdate(e,1)}
      onKeyDown={props.keyDownUpdate}
    />
  </div>
);


export default Paragraph;
