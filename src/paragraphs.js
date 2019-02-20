import React from 'react';
import Paragraph from './paragraph';
import '../styles.sass';

const Paragraphs = props => (
  <div className="paragraphs">
    {props.pars.map((par, index) => (
      <Paragraph
        par={par}
        handleClick={props.handleClick}
        keyUpUpdate={props.keyUpUpdate}
        keyDownUpdate={props.keyDownUpdate}
        state={props.state}
        key={index}
      />
    ))}
  </div>
);

export default Paragraphs;
