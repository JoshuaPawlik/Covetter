import React from 'react';
import '../styles.sass';

const Paragraph = (props) => {
  const {
    parNum,
    text,
    handleClick,
    keyDownUpdate,
    keyUpUpdate,
  } = props;
  return (
    <div className="paragraph">
      {/* Number */}
      <h3 className="p-num" onClick={handleClick}>{parNum}</h3>
      {/* Textfield */}
      <div
        contentEditable
        type="text"
        id={`par${parNum}`}
        className="textarea"
        onKeyUp={e => keyUpUpdate(e, 1)}
        onKeyDown={keyDownUpdate}
      >
        {text}
      </div>
    </div>
  );
};


export default Paragraph;
