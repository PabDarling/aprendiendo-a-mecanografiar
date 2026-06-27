// score.model.js

const sql = require('mssql');

const Score = {};

Score.create = async (userId, score) => {
  try {
    const pool = await sql.connect(dbConfig); // dbConfig debe ser tu configuración de conexión a SQL Server
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('score', sql.Int, score)
      .query('INSERT INTO Scores (UserId, Score) VALUES (@userId, @score)');
    
    return result.rowsAffected[0];
  } catch (error) {
    throw error;
  }
};

Score.findAllByUserId = async (userId) => {
  try {
    const pool = await sql.connect(dbConfig); // dbConfig debe ser tu configuración de conexión a SQL Server
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Scores WHERE UserId = @userId');

    return result.recordset;
  } catch (error) {
    throw error;
  }
};

module.exports = Score;
