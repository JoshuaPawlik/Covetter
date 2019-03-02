/* eslint no-multi-assign: "off" */

// /* eslint-disable*/
// const electron = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
const EventEmitter = require('events');
const fs = require('fs');
// Modules to control application life and create native browser window
const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');

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

const exportPDF = exports.exportPDF = (title) => {
  console.log('running testPDF');


  console.log('title ---->', title)

  const filePath = dialog.showSaveDialog(mainWindow, {
    title: 'Save PDF',
    defaultPath: path.join(app.getPath('desktop'), `${title}`),
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
    ],
  });

  if (!filePath) {
    console.log('cancelled out');
    return;
  }

  mainWindow.webContents.printToPDF({ pageSize: 'Letter' }, (error, data) => {
    if (error) throw error;
    fs.writeFile(filePath, data, (err) => {
      if (err) throw err;
      console.log('Write PDF successfully.')
    });
  });
};


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

const sendFiles = exports.sendFiles = async (tf) => {
  const files = await knex.select('*').from('files').orderBy('id', 'desc');
  const pars = await knex.select('*').from('pars');

  const filesWithPars = files.map((file) => {
    const fileId = file.id;

    const parsForFile = pars.filter(par => par.file_id === fileId);
    file.pars = parsForFile;
    // console.log('parsForFile', parsForFile)
    return file;
  });

  mainWindow.webContents.send('filesSent', filesWithPars, tf);
  // files.then((files) => {
  //   // console.log('files',files);
  // });
};

const save = exports.save = ((title, pars) => {
  console.log('in main.save title ===', title, 'pars===', pars);

  knex('files').insert({ title })
    .then((result) => {
      pars.forEach((par) => {
        const { text, par_num } = par;
        const file_id = result[0];
        // const text = par.text;
        // const par_num = par.par_num;

        knex('pars').insert({ file_id, par_num, text })
          .catch();
      });
    }).catch();
});


const util = require('util');

const update = exports.update = ((id, title, pars) => {
  knex('files').where('id', '=', id).update({ title })
    .then(() => {
      pars.forEach((par) => {
        console.log('inside forEach')
        const { text, par_num } = par;
        const file_id = id;
        // console.log('par in update', par);
        //
        // knex('pars').where('file_id', '=', id).andWhere('par_num', '=', par_num).update({
        //   text
        // })
        //   .catch((e) => { console.error(e); });

        const insertPar = ({ file_id, par_num, text }) => {
          console.log('insidePar', file_id, par_num, text);

          const insert = knex('pars').insert({ file_id, par_num, text }).catch();

          const updatePar = knex('pars')
            .whereRaw(`file_id = ${file_id}`)
            .andWhere('par_num', '=', par_num)
            .update({ text })
            .catch();


          const query = util.format(
            '%s ON CONFLICT (par_num) DO UPDATE SET %s',
            insert,
            updatePar,
          );

          return knex.raw(query);
        };


        insertPar({ file_id, par_num, text });
      });
      console.log('updated file');
    })
    .catch();
});

const deleteFile = exports.deleteFile = ((id) => {
  console.log('id in delete', id);
  knex('files').where('id', '=', id).delete()
    .then(() => {
      mainWindow.webContents.send('fileDeleted', id);
      knex('pars').where('file_id', '=', id).delete()
        .catch((e) => {
          console.error('ERROR!!!!!!!!!', e);
        });
      console.log('deleted file');
    })
    .catch((e) => {
      console.error('ERROR!!!!!!!!!', e);
    });
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
