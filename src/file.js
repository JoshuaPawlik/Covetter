import React from 'react';
import '../styles.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';

const File = (props) => {
  const {
    file,
    title,
    par1,
    onFileClick,
    deleteFile,
    activeFileId,
  } = props;
  return (
    <div className={`tinyPrev ${file.id === activeFileId ? 'active' : ''}`} onClick={() => { onFileClick(file); }}>
      <FontAwesomeIcon id={file.id} icon={faTrashAlt} className="delete" onClick={(e) => { deleteFile(e, file.id); }} />
      {/* <p1 className="delete">X</p1> */}
      <h3 className="title">{title.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '')}</h3>
      <h6 className="par1">{par1.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}</h6>
    </div>
  );
};

export default File;
