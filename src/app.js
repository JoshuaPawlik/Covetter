import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import Writing from './writing.js'
import {ipcRenderer} from 'electron'

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
  //Preview whole
  //Create File
  //Add Paragraph
  //Delete file
  //Add alternate paragraph
  //Switch Paragraph
  //open file
  //new file

  onSave = () =>{
    console.log('clicked onSave');
    let title = this.state.title;
    console.log('title',title)
    let par1 = this.state.par1;
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
    var ref = {9:9,13:13,16:16,17:17,18:18,27:27,37:37,38:38,39:39,40:40,91:91,93:93}
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
    ipcRenderer.on("resultSent", function(evt, result){
      // let resultEl = document.getElementById("result");
      console.log('result',result);
      for(var i = 0; i < result.length;i++){
        console.log('something');
      }
    });
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

            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>
            <div className="tinyPrev">
              {this.state.par1}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
