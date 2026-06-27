module.exports = (ipcMain,db) => {
    ipcMain.handle("saveScore", (event, { user_id, puntos, duracion, dificultad }) =>{
        const stmt = db.prepare("INSERT INTO scores(user_id, puntos, fecha, duracion, dificultad) VALUES (?, ?, datetime('now'), ?, ?)");
        const info = stmt.run(user_id, puntos, duracion, dificultad);
        return {id: info.lastInsertRowid, user_id, puntos, duracion, dificultad};
    });

    ipcMain.handle("getScores", () => {
        const stmt = db.prepare(`
            SELECT s.id_score, u.nombre, s.puntos, s.fecha, s.duracion, s.dificultad
            FROM scores s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.puntos DESC
            LIMIT 10
        `);
        return stmt.all();
    });

    ipcMain.handle("getUserScore", (event, userId) =>{
        const stmt = db.prepare(`
            SELECT s.id_score, u.nombre, s.puntos, s.fecha, s.duracion, s.dificultad
            FROM scores s
            JOIN  users u ON s.user_id = u.id
            WHERE u.id = ?
            ORDER BY s.puntos DESC
            LIMIT 10
        `)
        return stmt.all(userId);
    })    
};