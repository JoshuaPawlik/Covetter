import React from 'react';
import File from './file.js'
import '../styles.sass';

const Files = (props) => (
  <div className="files">
   {props.files.map((file, index) => <File file={file} title={file.title} par1={file.par1} key={index} onFileClick={props.onFileClick} deleteFile={props.deleteFile} state={props.state}/>
 )}
  </div>
);

export default Files;
