import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import Writing from './writing.js'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      text: "",
      mode: "editing"
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

  preview = () => {
    this.setState({mode:"preview"})
  }


  keyDownUpdate = (e) => {
    var key = e.keyCode
    if (key === 13){
      // console.log("WTFWTF")
      e.preventDefault();
    }
  }

  keyUpUpdate = (e) => {
    var key = e.keyCode
    var text = e.target.innerHTML.replace(/&nbsp;/g,'')
    // console.log('e.target.innerHTML',e.target.innerHTML)
    var ref = {9:9,16:16,17:17,18:18,37:37,38:38,39:39,40:40,91:91,93:93}
    if (ref[key]){
      return;
    }
    else {
      this.setState({text:text})
    }
  }



  handleClick = () => {
    console.log('clicked');
  }

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <FontAwesomeIcon icon={faHome} className="home-icon" onClick={this.handleClick.bind(this)} />
          <FontAwesomeIcon icon={faSave} className="home-icon" onClick={this.handleClick.bind(this)} />
          <FontAwesomeIcon icon={faPlusSquare} className="home-icon" onClick={this.handleClick.bind(this)} />
        </div>
        <div className="writingCom">
          {this.state.mode === 'editing' && <Writing keyUpUpdate={this.keyUpUpdate.bind(this)}  keyDownUpdate={this.keyDownUpdate.bind(this)} handleClick={this.handleClick.bind(this)}/>}

          <div className='prevContainer'>

            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>
            <div className="tinyPrev">
              {this.state.text}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
