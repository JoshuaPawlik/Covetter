import React from 'react';
import '../styles.sass';

const File = (props) => (
  <div className="tinyPrev" onClick={() => {props.onFileClick(props.file)}}>
   <h3 className="title">{props.title.replace(/<[^>]*>/g, '').replace(/&nbsp;/g,'')}</h3>
   <h6 className="par1">{props.par1.replace(/<[^>]*>/g, '').replace(/&nbsp;/g,' ')}</h6>
  </div>
);

export default File;
