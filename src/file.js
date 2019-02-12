import React from 'react';
import '../styles.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';

const File = props => (
  <div className={`tinyPrev ${props.file.id === props.state.id ? 'active' : ''}`} onClick={() => { props.onFileClick(props.file); }}>
    <FontAwesomeIcon id={props.file.id} icon={faTrashAlt} className="delete" onClick={(e) => { props.deleteFile(e, props.file.id); }} />
    {/* <p1 className="delete">X</p1> */}
    <h3 className="title">{props.title.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '')}</h3>
    <h6 className="par1">{props.par1.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}</h6>
  </div>
);

export default File;
