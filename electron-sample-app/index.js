const {app, BrowserWindow, crashReporter} = require('electron')
const path = require('path')
const url = require('url')

let win

// crashReporter.start({
// 	companyName: 'Company Name',
// 	submitURL: 'https://pacific-falls-32011.herokuapp.com/',
// 	autoSubmit: true,
// 	ignoreSystemCrashHandler: true,
// 	extra: {extra: 'info from the main process'},
// })

app.on('ready', () => {
 crashReporter.start({
  productName: 'SA Zulip',
  companyName: 'SA Zulip',
  submitURL: 'http://localhost:4567/crashreport',
  autoSubmit: true
  });
})

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600})

	win.loadURL(
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file',
		})
	)

	win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (win === null) createWindow()
})
