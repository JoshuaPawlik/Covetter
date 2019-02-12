// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
const EventEmitter = require('events');
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
// require('electron-reload')(__dirname);
const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(app.getAppPath(), '/database.sqlite'),
  },
  // useNullasDefault: true
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1200, height: 800, show: false });
  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.setMaxListeners(20);
  knex.migrate.latest()
    .then(() => {
	  console.log('ran a migration');
    }).catch((err) => {
      console.log('err!!!!!!!!!!', err);
    });

  console.log(ipcMain.getMaxListeners());

  createWindow();
});


const testMain = exports.testMain = () => {
  console.log('DOES IT WORK!!!!!');
};

const sendFiles = exports.sendFiles = (tf) => {
  const files = knex.select('*').from('files').orderBy('id', 'desc');
  files.then((files) => {
    // console.log('files',files);
    mainWindow.webContents.send('filesSent', files, tf);
  });
};

const save = exports.save = ((title, par1, par2, par3) => {
  // console.log('stuff',title,par1,par2,par3);
  knex('files').insert({
    title, par1, par2, par3,
  }).then(() => { console.log('inserted into database'); }).catch((e) => {
    console.error(e);
  });
});


const update = exports.update = ((id, title, par1, par2, par3) => {
  console.log('stuff', id, title, par1, par2, par3);
  knex('files').where('id', '=', id).update({
    title, par1, par2, par3,
  }).then(() => { console.log('updated file'); })
    .catch((e) => {
      console.error(e);
    });
});

const deleteFile = exports.deleteFile = ((id) => {
  console.log('id in delete', id);
  knex('files').where('id', '=', id).delete().then(() => {
    console.log('deleted file');
    mainWindow.webContents.send('fileDeleted', id);
  })
    .catch((e) => {
      console.error('ERROR!!!!!!!!!', e);
    });
  // console.log(ipcMain.listenerCount('delete'))
  // console.log(ipcMain.listenerCount('filesSent'))
  // console.log(mainWindow.webContents.listenerCount('fileDeleted'));
  // console.log(mainWindow.webContents.listenerCount('filesSent'));
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Get Files
// ipcMain.on("needFiles", function () {
//   let files = knex.select("*").from("files").orderBy('id','desc')
//   files.then(function(files){
//     // console.log('files',files);
//     mainWindow.webContents.send("filesSent", files);
//   })
// });


// Delete
// ipcMain.on('delete',(evt,id) => {
// 	// console.log('id in delete',id);
// 	knex('files').where('id','=',id).delete().then(()=> {
//     console.log('deleted file')
//     mainWindow.webContents.send("fileDeleted");
// }).catch((e) => {
// 		console.error(e)
// 	})
//   // console.log(ipcMain.listenerCount('delete'))
//   // console.log(ipcMain.listenerCount('filesSent'))
//   console.log(mainWindow.webContents.listenerCount('fileDeleted'));
//   console.log(mainWindow.webContents.listenerCount('filesSent'));
// })


// Update
// ipcMain.on('update',(evt,id,title,par1,par2,par3) => {
// 	console.log('stuff',id,title,par1,par2,par3);
// 	knex('files').where('id','=',id).update({title:title,par1:par1,par2:par2,par3:par3}).then(()=> {console.log('updated file')}).catch((e) => {
// 		console.error(e)
// 	})
// })

// Save
// ipcMain.on('save',(evt,title,par1,par2,par3) => {
// 	// console.log('stuff',title,par1,par2,par3);
// 	knex('files').insert({title:title,par1:par1,par2:par2,par3:par3}).then(()=> {console.log('inserted into database')}).catch((e) => {
// 		console.error(e)
// 	})
// })
