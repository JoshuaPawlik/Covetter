import React from 'react';
import '../styles.sass';
import Paragraphs from './paragraphs';

class Writing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const pars = this.props.pars || [1, 2, 3]; // eslint-disable-line react/destructuring-assignment
    const {
      updateTitle,
      handleClick,
      keyDownUpdate,
      keyUpUpdate,
      state,
    } = this.props;

    const { titleClass } = state;

    return (
      <div className="writing">
        <div className="content">
          <div className="titleDiv">
            <input type="text" id="title" placeholder="Title" className={titleClass} onChange={e => updateTitle(e)} />
          </div>
          <div className="paragraphs">
            <Paragraphs
              pars={pars}
              handleClick={handleClick.bind(this)}
              keyUpUpdate={keyUpUpdate.bind(this)}
              keyDownUpdate={keyDownUpdate.bind(this)}
            />
          </div>
        </div>
        {' '}
        {/* Writing */}
      </div>
    );
  }
}

export default Writing;
