import React from 'react';
import '../styles.sass';

const Paragraph = (props) => {
  const {
    parNum,
    text,
    handleClick,
    keyDownUpdate,
    keyUpUpdate,
    addParagraph,
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
        onKeyUp={e => keyUpUpdate(e, parNum)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
            addParagraph(e);
          } else {
            keyDownUpdate(e);
          }
        }}
      >
        {text}
      </div>
    </div>
  );
};


export default Paragraph;
