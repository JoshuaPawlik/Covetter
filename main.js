// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
// require('electron-reload')(__dirname);

var knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "./database.sqlite"
	}
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 800,show:false})
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  createWindow();
  ipcMain.on("mainWindowLoaded", function () {
		// knex('files').insert({title:'hihihihihi'}).catch((e) => {
		// 	console.log('error',e)
		// })
		let result = knex.select("*").from("files")
		result.then(function(rows){
			console.log('rows',rows);
			mainWindow.webContents.send("resultSent", rows);
		})
	});

})


ipcMain.on('save',(evt,title,par1,par2,par3) => {
	console.log('Ive heard your on save back here');
	console.log('otherstuff',title,par1,par2,par3);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
