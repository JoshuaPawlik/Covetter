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
      title: "",
      par1: "",
      par2: "",
      par3: ""
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


  newFile = () => {

  }

  onSave = () =>{
    console.log('clicked onSave');
    let title = this.state.title;
    console.log('title',title)
    let par1 = this.state.par1;
    console.log('par1',par1)
    let par2 = this.state.par2;
    let par3 = this.state.par3;
    ipcRenderer.send('save',title,par1,par2,par3);
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
    var text = e.target.innerHTML.replace(/&nbsp;/g,'')
    var ref = {9:9,13:13,16:16,17:17,18:18,27:27,37:37,38:38,39:39,40:40,93:93}
    if (!ref[key]){
      //Don't try to console.log state because it shows
      //the updated content in state late
      this.setState({[`par${num}`]:text})
    }
  }



  handleClick = () => {
    console.log('clicked');
  }

  componentDidMount(){
    ipcRenderer.send("mainWindowLoaded")
    ipcRenderer.on("filesSent", (evt, files) => {
      this.setState({files:files})
    })
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
            keyUpUpdate={this.keyUpUpdate.bind(this)}  keyDownUpdate={this.keyDownUpdate.bind(this)} handleClick={this.handleClick.bind(this)}
            updateTitle={this.updateTitle.bind(this)}
          />}

          <div className='prevContainer'>
            {this.state.files ? <Files files={this.state.files}/>: null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
