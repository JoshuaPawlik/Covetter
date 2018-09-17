// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
// require('electron-reload')(__dirname);
var path = require('path');
var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(app.getAppPath(), '/database.sqlite')
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 800,show:false})
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

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
	knex.migrate.latest()
	.then(() => {
	  console.log('ran a migration')
	})

  // knex('files').insert({title:'hihihihihi'}).catch((e) => {
  // 	console.log('error',e)
  // })


  createWindow();
  ipcMain.on("mainWindowLoaded", function () {
		// knex('files').insert({title:'hihihihihi'}).catch((e) => {
		// 	console.log('error',e)
		// })
		let files = knex.select("*").from("files")
		files.then(function(rows){
			console.log('rows',rows);
			mainWindow.webContents.send("filesSent", rows);
		})
	});

	// ipcMain.on('wow', () => {
	// 	mainWindow.webContents.send('whoa')
	// })

})


ipcMain.on('save',(evt,title,par1,par2,par3) => {
	console.log('stuff',title,par1,par2,par3);
	knex('files').insert({title:title,par1:par1,par2:par2,par3:par3}).then(()=> {console.log('inserted into database')}).catch((e) => {
		console.error(e)
	})
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
