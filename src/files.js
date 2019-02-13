import React from 'react';
import File from './file';
import '../styles.sass';

const Files = (props) => {
  const {
    files,
    onFileClick,
    deleteFile,
    activeFileId,
  } = props;
  return (
    <div className="files">
      {files.map((file, index) => (
        <File
          file={file}
          title={file.title}
          par1={file.par1}
          key={index}
          onFileClick={onFileClick}
          deleteFile={deleteFile}
          activeFileId={activeFileId}
        />
      ))}
    </div>
  );
};

export default Files;
