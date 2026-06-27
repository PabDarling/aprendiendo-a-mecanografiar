const { ipcMain } = require("electron");
const {loginUser, registerUser } = require("./db");

module.exports = (ipcMain, db) => {
    ipcMain.handle("login", (event, {nombre, password}) => {
        console.log("[ipc] INTENTANDO INGRESAR:", nombre);
        const result2 = loginUser(db, nombre, password);
        console.log("[ipc] Igreso exitoso:", result2);
        return loginUser(db, nombre, password);
    });

    ipcMain.handle("register", (event, {nombre, password}) =>{
        try {
            console.log("[ipc] INTENTANDO REGISTRAR:", nombre);
            const result = registerUser(db, nombre, password);
            console.log("[ipc] registro exitoso:", result);
            return result;
        } catch (e) {
            console.log("[ipc] ERROR:", e);
            return { error: e.message };
        } 
    });

};
