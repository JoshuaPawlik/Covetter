import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      whole: ""
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

  }

  update = (e) => {
    console.log('change!!!', e.target.innerHTML)
    this.setState({whole:e.target.innerHTML});
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
        <div className="writing">
          <div>
            <input type='text' placeholder="Type your title" className="title"></input>
          </div>
          <div className="paragraph">
            {/* Number */}
            <h3 className="p-num">1</h3>
            {/* Textfield */}
            <div contentEditable type='text' className="textarea" placeholder="Paragraph 1" tabIndex="0" onInput={this.update.bind(this)}></div>

          </div>
          <div className="paragraph">
            {/* Number */}
            <h3 className="p-num" onClick={this.handleClick.bind(this)}>2</h3>
            {/* Textfield */}
            <div contentEditable type='text' className="textarea" placeholder="Paragraph 2" tabIndex="0" onInput={this.update.bind(this)}></div>

          </div>
          <div className="paragraph">
            {/* Number */}
            <h3 className="p-num" onClick={this.handleClick.bind(this)}>3</h3>
            {/* Textfield */}
            <div contentEditable type='text' className="textarea" placeholder="Paragraph 3" tabIndex="0" onInput={this.update.bind(this)}></div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
