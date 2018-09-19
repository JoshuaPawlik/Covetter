import React, {Component} from 'react';
import '../styles.sass';
class Writing extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <div className="writing">
        <div className="content">
          <div className="titleDiv">
            <input type='text' placeholder={"Title"} className="title" onChange={(e) => this.props.updateTitle(e)}></input>
          </div>
          <div className='paragraphs'>
            <div className="paragraph">
              {/* Number */}
              <h3 className="p-num" onClick={this.props.handleClick}>1</h3>
              {/* Textfield */}
              <div contentEditable type='text' className="textarea" placeholder="Paragraph 1" onKeyUp={(e) => this.props.keyUpUpdate(e,1)} onKeyDown={this.props.keyDownUpdate}></div>

            </div>
            <div className="paragraph">
              {/* Number */}
              <h3 className="p-num" onClick={this.props.handleClick}>2</h3>
              {/* Textfield */}
              <div contentEditable type='text' className="textarea" placeholder="Paragraph 2" onKeyUp={(e) => this.props.keyUpUpdate(e,2)} onKeyDown={ this.props.keyDownUpdate}></div>

            </div>
            <div className="paragraph">
              {/* Number */}
              <h3 className="p-num" onClick={this.props.handleClick}>3</h3>
              {/* Textfield */}
              <div contentEditable type='text' className="textarea" placeholder="Paragraph 3" onKeyUp={(e) => this.props.keyUpUpdate(e,3)} onKeyDown={ this.props.keyDownUpdate}></div>

            </div>
          </div>
        </div> {/*Writing*/}
      </div>
    )
  }
}

export default Writing;
