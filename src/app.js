import React, {Component} from 'react';
import '../styles.sass';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  // TODO: Add functions for:
  //Create File
  //Add Paragraph
  //Delete file
  //Add alternate paragraph
  //Switch Paragraph
  //open file
  //new file

  handleClick = () => {
    console.log('clicked');
  }

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <FontAwesomeIcon icon={faHome} className="home-icon" onClick={this.handleClick.bind(this)} />
        </div>
        <div className="writing">
          <div>
            <input type='text' placeholder="Type your title" className="title"></input>
          </div>
          <textarea type='text' className="textarea"></textarea>
        </div>
      </div>
    );
  }
}

export default App;
