import React from 'react';
import '../styles.sass';

const File = (props) => (
  <div className="tinyPrev">
   <h3 className="title">{props.title}</h3>
   <h6 className="par1">{props.par1}</h6>
  </div>
);

export default File;
