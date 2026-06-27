const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const { error } = require("console");

function ensureDb() {
    const userDataPath = app.getPath("userData");
    const dbPath = path.join(app.getPath("userData"), "Aprendiendo.db");

    const bundledDbPath = path.join(process.resourcesPath, "Aprendiendo.db");

    try {
        if(!fs.existsSync(dbPath)) {
            if (fs.existsSync(bundledDbPath)) {
                fs.copyFileSync(bundledDbPath, dbPath);
                console.log("📁Base de datos copiada por primera vez a:", dbPath);
            } else {
                console.warn("⚠️Base de datos empaquetada no encontrada, se creara nueva vacia.");
            }
        } else {
            console.log("✅Base de datos encontrada:", dbPath);
        }
    } catch (err) {
        console.error("❌Error al preparar base de datos: ", err);
    }

    const db = new Database(dbPath);

    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS scores (
        user_id INTEGER NOT NULL,
        puntos INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `).run();

    return db;
}

function registerUser(db, nombre, password) {
    const hashed = bcrypt.hashSync(password, 10);
    try {
        const stmt = db.prepare("INSERT INTO users (nombre, password) VALUES (?,?)")
        const info = stmt.run(nombre, hashed);
        return { id: info.lastInsertRowid, nombre };
    } catch(e) {
        if (e.code === "SQL_CONSTRAINT_UNIQUE") {
            throw new Error("El usuario ya existe");
        }
        throw e; 
    }
}

function loginUser(db, nombre, password) {
    const stmt = db.prepare("SELECT * FROM users WHERE nombre = ?");
    const user = stmt.get(nombre);
    if(!user) return null;
    
    const valid = bcrypt.compareSync(password, user.password);
    if(!valid) return null;

    return {id: user.id, nombre: user.nombre };
}

module.exports = { ensureDb, registerUser, loginUser };