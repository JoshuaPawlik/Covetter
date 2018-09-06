// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

const {app, BrowserWindow} = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({width: 800, height: 600, show:false});
  win.loadURL(`file://${__dirname}/index.html`);

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();
});
