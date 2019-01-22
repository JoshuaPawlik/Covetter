import React, {Component} from 'react';
import './styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faFill } from '@fortawesome/free-solid-svg-icons/faFill';
import Writing from './src/writing.js'
import {remote, ipcRenderer} from 'electron'
import Files from './src/files'

// The only way I was able to get this to work was to move my app.js into
// the same location as main.js
const main = remote.require('./main.js')

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
      activeFile:null,
      values: {}
    }
  }

  // TODO: Add functions for:
  // select : select all of a specific word
  //Add Paragraph
  //Add alternate paragraph
  //Switch Paragraph

  // TODO:

  // Add variable input to select all of a given word
  //Make sure database works correctly when packaging with asar again

    componentDidMount(){
      // console.log('main',main)
      this.getFiles();

      //Listeners are set here because if they are set inside of functions
      //they will exceed max listeners count and slow down the app

      ipcRenderer.on("filesSent", (evt, files, tf) => {
        console.log('tf',tf)
        if (tf){
          this.setState({files:files}, () => {
            console.log('3.B set file to [0]')
            this.setActiveFile(this.state.files[0])
          })
        }
        else {
          console.log('3.A')
          this.setState({files:files});
        }
      })


      ipcRenderer.on('fileDeleted',(evt,id) =>{
        this.getFiles()
        if (id === this.state.id){
          this.newFile();
        }
      })

    }
    //------------------------------------
   fillDumbyData = () => {
    for (var i = 0; i < 10;i++){
      this.save(`Test ${i+1}`,'','','');
    }
    this.getFiles();
  }
  //------------------------------------
  testMain = () => {
    main.testMain()
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
  onFileClick = (file) => {
    console.log('onFileClick ran')
    if (document.getElementById('title').value !== ""){
      //this invoke is causing setActiveFile to run twice
      console.log('1.A')
      this.onSave();
      this.setActiveFile(file)
    } else {
      console.log('1.B')
      this.setActiveFile(file)
    }
    // console.log(title,'title')
    // console.log('file in onFileClick',file)
  }
  //------------------------------------
  onSave = () => {
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
      console.log('2.Update');
      main.update(id,title,par1,par2,par3);
      this.getFiles();
    }
    else {
      //save new file if it does not exists
      console.log('2.New');
      this.save(title,par1,par2,par3);
      this.getFiles(true)
    }
  }
  //------------------------------------
  getFiles = (tf) => {

    if (tf){
      main.sendFiles(true)
    } else {
      main.sendFiles(false)
    }

  }
  //------------------------------------
  setActiveFile = (file) => {
    // make sure all changes are updated to active file
    console.log('file',file)
    console.log('4.setActiveFile')
    this.setState({id:file.id})
    //set all textfield values
    document.getElementById('title').value = file.title;
    document.getElementById('par1').innerHTML = file.par1
    document.getElementById('par2').innerHTML = file.par2;
    document.getElementById('par3').innerHTML = file.par3;
  }
  //------------------------------------
  save = (title,par1,par2,par3) => {
    main.save(title,par1,par2,par3);
    //retrieve files
    // this.getFiles()
  }
  //------------------------------------
  deleteFile = (e,id) => {
    console.log('deleteFile clicked',e,id);
    e.stopPropagation();
    main.deleteFile(id);
    // ipcRenderer.send('delete',id);
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
    console.log('innerHTML', text)
    var ref = {9:9,13:13,16:16,17:17,18:18,27:27,37:37,38:38,39:39,40:40,93:93}
    if (!ref[key]){
      //Don't try to console.log state because it shows
      //the updated content in state late
      this.setState({[`par${num}`]:text})
    }
  }
  //------------------------------------
  //Doesn't work because once the value is changed the first time it no
  //no longer has brackets around it
  replace = (e) => {
    let value = e.target.value;
    document.getElementById('title').value = document.getElementById('title').value.replace(/{[^>]*}/g, `{${value}}`);
    document.getElementById('par1').innerHTML = document.getElementById('par1').innerHTML.replace(/{[^>]*}/g, `{${value}}`);
    document.getElementById('par2').innerHTML = document.getElementById('par2').innerHTML.replace(/{[^>]*}/g, `{${value}}`);
    document.getElementById('par3').innerHTML = document.getElementById('par3').innerHTML.replace(/{[^>]*}/g, `{${value}}`);
  }
  //------------------------------------
  handleClick = () => {
    document.getElementById('par1').innerHTML = "Changed value"
    // console.log('clicked');
  }

  testButton = () => {
    this.setState({show: !this.state.show});
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
            <div className="whole">
              <Writing
                state={this.state}
                keyUpUpdate={this.keyUpUpdate.bind(this)}  keyDownUpdate={this.keyDownUpdate.bind(this)} handleClick={this.handleClick.bind(this)}
                updateTitle={this.updateTitle.bind(this)}
              />
              <div className="editBar">
                <input className="variableInput" placeholder="Company" onChange={(e) => {
                  this.replace(e)
                }}></input>
              </div>
            </div>
            <div>
              <button onClick={this.testButton.bind(this)}></button>
            </div>
            { this.state.show ? <div className='prevContainer'>
              {this.state.files ? <Files onFileClick={this.onFileClick.bind(this)}
                files={this.state.files}
                deleteFile={this.deleteFile.bind(this)}
                state = {this.state}
              />: null}
            </div> : null }
        </div>
      </div>
    );
  }
}

export default App;
