import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faFill } from '@fortawesome/free-solid-svg-icons/faFill';
import Writing from './writing.js'
import {ipcRenderer} from 'electron'
import Files from './files'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id:null,
      title: "",
      par1: "",
      par2: "",
      par3: "",
      titleClass:"title",
      activeFile:null
    }
  }

  // TODO: Add functions for:
  //new/create file
  //Add Paragraph
  //Delete file
  //Add alternate paragraph
  //Switch Paragraph
  //open file

  // TODO:
  //Make sure database works correctly when packaging with asar again

    componentDidMount(){
      this.getFiles();
      ipcRenderer.setMaxListeners(20);
    }
    //------------------------------------
   fillDumbyData = () => {
    for (var i = 0; i < 10;i++){
      this.save(`Test${i+1}`,'','','');
    }
    this.getFiles();
  }
  //------------------------------------
  newFile = () => {
    //make sure you're not editing another existing file
    this.setState({id:""});
    //clear all textfields
    document.getElementById('title').value = "";
    document.getElementById('par1').innerHTML = "";
    document.getElementById('par2').innerHTML = "";
    document.getElementById('par3').innerHTML = "";
  }
  //------------------------------------
  setActiveFile = (file) => {
    // console.log('file',file)
    console.log('setActiveFile Ran')
    // make sure all changes are updated to active file

    this.setState({id:file.id})
    //set all textfield values
    document.getElementById('title').value = file.title;
    document.getElementById('par1').innerHTML = file.par1
    document.getElementById('par2').innerHTML = file.par2;
    document.getElementById('par3').innerHTML = file.par3;
  }
  //------------------------------------
  onFileClick = (file) => {
    // console.log(title,'title')
    // console.log('file',file)
    this.setActiveFile(file)
  }
  //------------------------------------
  onSave = () =>{
    let id = this.state.id;
    let title = document.getElementById('title').value;
    let par1 = document.getElementById('par1').innerHTML;
    let par2 = document.getElementById('par2').innerHTML;
    let par3 = document.getElementById('par3').innerHTML;

    //Checks to make sure Title is not empty
    if (title === ""){
      this.setState({titleClass:"title red-shake"})
      setTimeout(() => {
        this.setState({titleClass:'title'});
      }, 1000);
      return;
    }

    //update file if exists
    if (this.state.id){
      ipcRenderer.send('update',id,title,par1,par2,par3);
      this.getFiles();
    }
    else {
      //save new file if it not exists
      this.save(title,par1,par2,par3);
      this.getFiles();
    }
  }
  //------------------------------------
  save = (title,par1,par2,par3) => {
    ipcRenderer.send('save',title,par1,par2,par3);
    //retrieve files
    // this.getFiles()
  }
  //------------------------------------
  getFiles = () => {
    ipcRenderer.send("needFiles")
    ipcRenderer.on("filesSent", (evt, files) => {
      this.setState({files:files})
    })
  }
  //------------------------------------
  // someFunc = (e) => {
  //   console.log('e',e);
  //   console.log('filesSent listenerCount',ipcRenderer.listenerCount('filesSent'));
  //   // ipcRenderer.removeListener('filesSent')
  // }
  //------------------------------------
  deleteFile = (e,id) => {
    e.stopPropagation();
    ipcRenderer.send('delete',id);
    ipcRenderer.on('fileDeleted',(evt) =>{
      this.getFiles()
      if (id === this.state.id){
        this.newFile();
      }
    })
  }
  //------------------------------------
  //This function is mostly to prevent
  //unwanted actions
  keyDownUpdate = (e,num) => {
    var key = e.keyCode
    if (key === 13){
      e.preventDefault();
    }
    else if (key === 9){
      //prevents tab key from switching textfields
      e.preventDefault();
      //TODO: Add functionality to insert a double space on tab press
    }
  }
  //------------------------------------
  updateTitle = (e) => {
    let value = e.target.value;
    this.setState({title: value});
  }
  //------------------------------------
  //Updates state as you type
  keyUpUpdate = (e, num) => {
    var key = e.keyCode
    // var text = e.target.innerHTML.replace(/&nbsp;/g,'')
    var text = e.target.innerHTML
    var ref = {9:9,13:13,16:16,17:17,18:18,27:27,37:37,38:38,39:39,40:40,93:93}
    if (!ref[key]){
      //Don't try to console.log state because it shows
      //the updated content in state late
      this.setState({[`par${num}`]:text})
    }
  }
  //------------------------------------
  handleClick = () => {
    document.getElementById('par1').innerHTML = "Changed value"
    // console.log('clicked');
  }

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          {/* <FontAwesomeIcon icon={faHome} className="home-icon" onClick={this.handleClick.bind(this)} /> */}
          <FontAwesomeIcon icon={faSave} className="home-icon" onClick={this.onSave.bind(this)} />
          <FontAwesomeIcon icon={faPlusSquare} className="home-icon" onClick={this.newFile.bind(this)} />
          <FontAwesomeIcon icon={faFill} className="home-icon" onClick={this.fillDumbyData.bind(this)} />
        </div>
        <div className="writingCom">
          <Writing
            state={this.state}
            keyUpUpdate={this.keyUpUpdate.bind(this)}  keyDownUpdate={this.keyDownUpdate.bind(this)} handleClick={this.handleClick.bind(this)}
            updateTitle={this.updateTitle.bind(this)}
          />

          <div className='prevContainer'>
            {this.state.files ? <Files onFileClick={this.onFileClick.bind(this)}
              files={this.state.files}
              deleteFile={this.deleteFile.bind(this)}
              state = {this.state}
            />: null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
