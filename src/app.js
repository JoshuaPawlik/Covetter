import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import Writing from './writing.js'
import {ipcRenderer} from 'electron'
import Files from './files'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mode: "editing",
      id:"",
      title: "",
      par1: "",
      par2: "",
      par3: "",
      titleClass:"title"
    }
  }

  // TODO: Add functions for:
  //new/create file
  //Preview whole
  //Add Paragraph
  //Delete file
  //Add alternate paragraph
  //Switch Paragraph
  //open file

  // TODO:
  //Make sure database works correctly when packaging with asar again

  newFile = () => {

  }

  onSave = () =>{
    let title = this.state.title;
    let par1 = this.state.par1;
    let par2 = this.state.par2;
    let par3 = this.state.par3;
    //Checks to make sure Title is not empty
    if (title === ""){
      this.setState({titleClass:"title red-shake"})
      setTimeout(() => {
        this.setState({titleClass:'title'});
      }, 1000);
      return;
    }
    //TODO:
    //update file if exists
    //save new file if it not exists
    this.save(title,par1,par2,par3);
    this.getFiles();
  }


  save = (title,par1,par2,par3) => {
    ipcRenderer.send('save',title,par1,par2,par3);
    //retrieve files
    this.getFiles()
  }

  preview = () => {
    this.setState({mode:"preview"})
  }


  //This function is mostly to prevent
  //unwanted actions
  keyDownUpdate = (e,num) => {
    var key = e.keyCode
    if (key === 13){
      e.preventDefault();
    }
    else if (key === 9){
      //attempting to prevent the tab key from
      //switching textfields and to insert a double space
      e.preventDefault();
      this.setState({text:this.state.text + '\xa0\xa0'})
    }
  }

  updateTitle = (e) => {
    let value = e.target.value;
    this.setState({title: value});
  }

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

  getFiles = () => {
    ipcRenderer.send("needFiles")
    ipcRenderer.on("filesSent", (evt, files) => {
      this.setState({files:files})
    })
  }


  handleClick = () => {
    console.log('clicked');
  }

  onFileClick = (title) => {
    console.log(title,'title')
  }

  // whoa = () => {
  //   console.log('ran!!')
  //   this.setState({title:'IPC IS WORKING'})
  // }

  componentDidMount(){
    // ipcRenderer.send('wow')
    // ipcRenderer.on('whoa', () => {
    //   this.whoa();
    // })
    this.getFiles();
  }

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <FontAwesomeIcon icon={faHome} className="home-icon" onClick={this.handleClick.bind(this)} />
          <FontAwesomeIcon icon={faSave} className="home-icon" onClick={this.onSave.bind(this)} />
          <FontAwesomeIcon icon={faPlusSquare} className="home-icon" onClick={this.handleClick.bind(this)} />
        </div>
        <div className="writingCom">
          {this.state.mode === 'editing' &&
          <Writing
            state={this.state}
            keyUpUpdate={this.keyUpUpdate.bind(this)}  keyDownUpdate={this.keyDownUpdate.bind(this)} handleClick={this.handleClick.bind(this)}
            updateTitle={this.updateTitle.bind(this)}
          />}

          <div className='prevContainer'>
            {this.state.files ? <Files onFileClick={this.onFileClick.bind(this)} files={this.state.files}/>: null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
