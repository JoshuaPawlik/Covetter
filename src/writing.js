import React from 'react';
import '../styles.sass';
import Paragraphs from './paragraphs';

class Writing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    // const pars = this.props.pars || [1, 2, 3]; // eslint-disable-line react/destructuring-assignment


    // console.log('---->', pars)

    const {
      newFilePars,
      addParagraph,
      activeFile,
      updateTitle,
      handleClick,
      keyDownUpdate,
      keyUpUpdate,
      titleClass,
    } = this.props;


    return (
      <div className="writing">
        <div className="content">
          <div className="titleDiv">
            <input
              type="text"
              id="title"
              placeholder="Title"
              className={titleClass}
              onChange={e => updateTitle(e)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  addParagraph(e);
                }
              }}
            />
          </div>
          <div className="paragraphs">
            <Paragraphs
              pars={activeFile ? activeFile.pars : newFilePars}
              handleClick={handleClick.bind(this)}
              keyUpUpdate={keyUpUpdate.bind(this)}
              keyDownUpdate={keyDownUpdate.bind(this)}
              addParagraph={addParagraph.bind(this)}
            />
          </div>
        </div>
        {' '}
        {/* Writing */}
        { /* <input type="text" id="title" placeholder="Title" className={titleClass} onChange={e => updateTitle(e)} /> */ }
      </div>
    );
  }
}

export default Writing;
