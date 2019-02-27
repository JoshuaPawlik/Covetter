import React from 'react';
import Paragraph from './paragraph';
import '../styles.sass';

const Paragraphs = (props) => {

  return (
    <div className="paragraphs">
      {props.pars.map((par) => (
        <Paragraph
          text={par.text}
          parNum={par.par_num}
          handleClick={props.handleClick}
          keyUpUpdate={props.keyUpUpdate}
          keyDownUpdate={props.keyDownUpdate}
          state={props.state}
        />
      ))}
    </div>
  );
};

export default Paragraphs;
