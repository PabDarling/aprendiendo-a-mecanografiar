const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
    login: (cred) => ipcRenderer.invoke("login", cred),
    register: (cred) => ipcRenderer.invoke("register", cred),
    saveScore: (data) => ipcRenderer.invoke("saveScore", data),
    getUserScore: (userId) => ipcRenderer.invoke("getUserScore", userId),
    getScores: () => ipcRenderer.invoke("getScores"),

});