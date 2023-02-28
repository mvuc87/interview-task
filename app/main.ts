import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from "fs";

let win: BrowserWindow = null;

function createWindow(): BrowserWindow {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,
    },
  });

  const debug = require('electron-debug');
  debug();
  require('electron-reloader')(module);
  win.loadURL('http://localhost:4200');
  win.webContents.openDevTools();

  // Receive event to read "employees.json"
  ipcMain.on("READ_EMPLOYEES", () => {
    const parsed = JSON.parse(fs.readFileSync("./data/employees.json").toString());
    win.webContents.send("READ_EMPLOYEES", parsed);
  });

  // Receive event to read "employee-shifts.json"
  ipcMain.on("READ_EMPLOYEES_SHIFTS", () => {
    const parsed = JSON.parse(fs.readFileSync("./data/employee-shifts.json").toString());
    win.webContents.send("READ_EMPLOYEES_SHIFTS", parsed);
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
