
import React, { Component } from 'react';
import './styles.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faFill } from '@fortawesome/free-solid-svg-icons/faFill';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown';
import { remote, ipcRenderer } from 'electron';
import Writing from './src/writing';
import Files from './src/files';

// The only way I was able to get this to work was to move my app.js into
// the same location as main.js
const main = remote.require('./main.js');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFileId: null,
      titleClass: 'title',
      button: false,
      show: true,
      title: '',
      newFilePars: [],
    };
    this.onSave = this.onSave.bind(this);
    this.newFile = this.newFile.bind(this);
    this.fillDumbyData = this.fillDumbyData.bind(this);
    this.keyUpUpdate = this.keyUpUpdate.bind(this);
    this.keyDownUpdate = this.keyDownUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.twoFuncs = this.twoFuncs.bind(this);
    this.onFileClick = this.onFileClick.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.addParagraph = this.addParagraph.bind(this);
  }

  // WHAT IF: We stored there was only one content editable div and instead of a set number of paragraphs we array.split() them at newline breaks and stored according to their index
  // But how would we switch out paragraph presets without them being broken up until after theyre stored.

  // TODO: Add functions for:
  // Add Paragraph by making it it's own react component
  // Add alternate paragraph
  // Switch Paragraph
  // Add save when clicking newFile
  // New file adds file to preview container

  // TODO:
  // Make sure database works correctly when packaging with asar again

  componentDidMount() {
    // console.log('main',main)
    this.getFiles();

    // Listeners are set here because if they are set inside of functions
    // they will exceed max listeners count and slow down the app

    ipcRenderer.on('filesSent', (evt, savedFiles, tf) => {
      // console.log('tf in listener', tf);
      console.log('received files', savedFiles);
      if (tf) {
        this.setState({ files: savedFiles }, () => {
          const {
            files: stateFiles,
          } = this.state;
          this.setActiveFile(stateFiles[0]); // eslint-disable-line react/destructuring-assignment
        });
      } else {
        console.log('3.A');
        this.setState({ files: savedFiles });
      }
    });


    ipcRenderer.on('fileDeleted', (evt, id) => {
      const { activeFileId } = this.state;
      this.getFiles();
      if (id === activeFileId) {
        this.newFile();
      }
    });
  }

  //------------------------------------
  onFileClick(file) {
    const {activeFileId} = this.state;
    console.log('onFileClick ran');
    if (file.id === activeFileId) {
      return;
    }
    const titleEl = document.getElementById('title');
    if (titleEl && titleEl.value !== '') {
      // this invoke is causing setActiveFile to run twice
      console.log('1.A');
      this.onSave('autosave');
      this.setActiveFile(file);
    } else {
      console.log('1.B');
      this.setActiveFile(file);
    }

    document.getElementById('variableInput').value = '';
    // console.log(title,'title')
    // console.log('file in onFileClick',file)
    console.log('------STATE', this.state);
  }

  //------------------------------------
  onSave(param) {
    const {
      activeFileId, title, newFilePars, activeFile,
    } = this.state;

    console.log('this.state in Onsave', this.state)
    console.log('passed in', title, newFilePars)

    // Checks to make sure Title is not empty
    if (title === '') {
      this.setState({ titleClass: 'title red-shake' });
      setTimeout(() => {
        this.setState({ titleClass: 'title' });
      }, 1000);
      return;
    }

    if (activeFileId) {
      const pars = activeFile.pars;
      // console.log('2.Update');
      main.update(activeFileId, title, pars);
      this.getFiles();
    }
    else if (param === 'autosave') {
      // auto saving the file onFileClick sets the new file to activeFile
      console.log('AUTOSAVE FIRED')
      this.setState({ newFilePars : [] })
      this.save(title, newFilePars);
      this.getFiles();
    } else {

      // save new file if it does not exists
      this.setState({ newFilePars : [] })
      console.log('2.New');
      main.save(title, newFilePars);
      this.getFiles(true);
    }
  }

  //------------------------------------
  getFiles(tf) {
    if (tf) {
      main.sendFiles(true);
    } else {
      main.sendFiles(false);
    }
  }

  //------------------------------------
  setActiveFile(file) {
    // make sure all changes are updated to active file
    console.log('file', file);
    console.log('4.setActiveFile');
    this.setState({ activeFileId: file.id, activeFile: file, title: file.title, newFilePars: [] }, () => {
      console.log('this.state in setActiveFile',this.state)
    });
    // set all titlefield value
    document.getElementById('title').value = file.title;
  }

  //------------------------------------
  newFile() {
    const { activeFile } = this.state;
    if (!activeFile) return;

    this.setState({
      activeFileId: '',
      activeFile: null,
    });
    const pars = activeFile.pars;

    document.getElementById('title').value = '';
    pars.forEach((par) => {
      document.getElementById(`par${par.par_num}`).innerHTML = '';
    });
  }

  //------------------------------------
  fillDumbyData() {
    for (let i = 0; i < 10; i += 1) {
      this.save(`Test ${i + 1}`, '', '', '');
    }
    this.getFiles();
  }

  //------------------------------------
  save(title, pars) {
    main.save(title, pars);
    // retrieve files
    // this.getFiles()
  }

  //------------------------------------
  deleteFile(e, id) {
    console.log('deleteFile clicked', e, id);
    e.stopPropagation();
    main.deleteFile(id);
    // ipcRenderer.send('delete',id);
  }

  //------------------------------------
  // This function is mostly to prevent
  // unwanted actions
  keyDownUpdate(e) {
    const key = e.keyCode;
    if (key === 13) {
      e.preventDefault();
    } else if (key === 9) {
      // prevents tab key from switching textfields
      e.preventDefault();
      // TODO: Add functionality to insert a double space on tab press
    }
  }

  //------------------------------------
  updateTitle(e) {
    const { value } = e.target;
    this.setState({ title: value });
  }

  //------------------------------------
  // Updates state as you type
  keyUpUpdate(e, num) {
    // console.log('e', e);
    // console.log('num', num);
    const key = e.keyCode;
    // var text = e.target.innerHTML.replace(/&nbsp;/g,'')
    const text = e.target.innerHTML;
    const ref = {
      9: 9, 13: 13, 16: 16, 17: 17, 18: 18, 27: 27, 37: 37, 38: 38, 39: 39, 40: 40, 93: 93,
    };
    if (!ref[key]) {
      // Don't try to console.log state because it shows
      // the updated content in state late
      if (this.state.activeFileId) {
        this.state.activeFile.pars[num - 1].text = e.target.innerHTML;
        console.log(this.state.activeFile.pars[num - 1].text)
      } else {
        this.state.newFilePars[num - 1].text = e.target.innerHTML;
      }
      // this.setState({ newFilePars: this.state.newFilePars[0].text });
    }
  }

  //------------------------------------
  replace(e) {
    const { value } = e.target;
    document.getElementById('title').value = document.getElementById('title').value.replace(/{.*?}/g, `{${value}}`);

    const numPars = this.state.activeFile ? this.state.activeFile.pars.length : this.state.newFilePars.length;

    for (let i = 1; i <= numPars; i++) {
      document.getElementById(`par${i}`).innerHTML = document.getElementById(`par${i}`).innerHTML.replace(/<span style="color:red">.*?<\/span>/g, `<span style="color:red">${value}</span>`);
      this.state.activeFile.pars[i-1].text = document.getElementById(`par${i}`).textContent
    }
  }

  //------------------------------------
  select() {
    const { value } = document.getElementById('selectBar');
    const re = new RegExp(value, 'g');

    if (value !== '') {
      document.getElementById('title').innerHTML = document.getElementById('title').innerHTML.replace(re, `<span style="color:red">{${value}}</span>`);

      const numPars = this.state.activeFile ? this.state.activeFile.pars.length : this.state.newFilePars.length;

      for (let i = 1; i <= numPars; i++) {
        document.getElementById(`par${i}`).innerHTML = document.getElementById(`par${i}`).innerHTML.replace(re, `<span style="color:red">${value}</span>`);
      }
    }
    document.getElementById('selectBar').value = '';
  }

  //------------------------------------
  deselect() {
    // let re = new RegExp(value, "g")
    const parSelectors = ['par1', 'par2', 'par3'];
    document.getElementById('title').value = document.getElementById('title').value.replace(/\{|\}/g, '');

    const numPars = this.state.activeFile ? this.state.activeFile.pars.length : this.state.newFilePars.length;

    for (let i = 1; i <= numPars; i++) {
      document.getElementById(`par${i}`).innerHTML = document.getElementById(`par${i}`).innerHTML.replace(/<span style="color:red">|<\/span>/g, '');
    }
    document.getElementById('variableInput').value = '';
  }

  //------------------------------------
  handleClick() {
    document.getElementById('par1').innerHTML = 'Changed value';
    // console.log('clicked');
  }

  //------------------------------------
  testButton() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  //------------------------------------
  buttonSwitch() {
    const { button } = this.state;
    this.setState({ button: !button });
  }

  //------------------------------------
  twoFuncs() {
    this.testButton();
    this.buttonSwitch();
  }
  //------------------------------------

  logHTML() {
    console.log(document.getElementById('title').innerHTML, document.getElementById('par1'));
  }
  //------------------------------------

  addParagraph(e) {
    const { activeFile } = this.state;
    // if (e) e.stopPropagation();
    console.log(this.state);


    if (!activeFile) {
      const temp = this.state.newFilePars.concat([{
        file_id: 0,
        par_num: this.state.newFilePars.length + 1,
        text: '',
      }]);
      this.setState({ newFilePars: temp }, () => {
        console.log(this.state.newFilePars);
        const num = this.state.newFilePars.length;
        document.getElementById(`par${num}`).focus();
        // console.log('div that should focus', div)
        // div.focus();
      });
    }
  }

  //------------------------------------
  render() {
    const {
      titleClass,
      button,
      show,
      files,
      activeFileId,
    } = this.state;
    return (
      <div className="app">
        <div className="sidebar">
          {/* <FontAwesomeIcon icon={faHome} className="home-icon" onClick={this.handleClick.bind(this)} /> */}
          <FontAwesomeIcon icon={faSave} className="home-icon" onClick={this.onSave} />
          <FontAwesomeIcon icon={faPlusSquare} className="home-icon" onClick={this.newFile} />
          <FontAwesomeIcon icon={faFill} className="home-icon" onClick={this.fillDumbyData} />
        </div>
        <div className="writingCom">
          <div className="whole">
            <Writing
              newFilePars={this.state.newFilePars}
              addParagraph={this.addParagraph}
              activeFile={this.state.activeFile}
              titleClass={titleClass}
              keyUpUpdate={this.keyUpUpdate}
              keyDownUpdate={this.keyDownUpdate}
              handleClick={this.handleClick}
              updateTitle={this.updateTitle}
            />
            <div className="editBar">
              <input id="selectBar" className="variableInput" onKeyDown={(e) => { if (e.keyCode === 13) this.select(); }} placeholder="Choose a variable" />
              <button type="submit" className="select-button" onClick={this.select}>Select</button>
              <input
                id="variableInput"
                className="variableInput"
                placeholder="Company Variable"
                onChange={(e) => { this.replace(e); }}
                onKeyDown={(e) => { if (e.keyCode === 13) this.deselect(); }}
              />
              {/* <button type="submit" className="select-button" onClick={this.logHTML}>logHTML</button> */}
              <button type="submit" className="select-button" onClick={this.deselect}>Deselect</button>
              <button type="submit" className="select-button" onClick={() => main.exportPDF(document.getElementById('title').value)}>Export PDF</button>
            </div>
          </div>
          <div className="button-div">
            <button type="submit" className="prev-button" onClick={this.twoFuncs}>
              {button ? <FontAwesomeIcon icon={faAngleDoubleUp} className="up-icon" /> : <FontAwesomeIcon icon={faAngleDoubleDown} className="up-icon" /> }
            </button>
          </div>
          { show ? (
            <div className="prevContainer">
              {files ? (
                <Files
                  onFileClick={this.onFileClick}
                  files={files}
                  deleteFile={this.deleteFile}
                  activeFileId={activeFileId}
                />
              ) : null}
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default App;
