// user.model.js

const sql = require('mssql');

const User = {};

User.findByEmail = async (email) => {
  try {
    const pool = await sql.connect(dbConfig); // dbConfig debe ser tu configuración de conexión a SQL Server
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    return result.recordset[0];
  } catch (error) {
    throw error;
  }
};

User.create = async (newUser) => {
  try {
    const pool = await sql.connect(dbConfig); // dbConfig debe ser tu configuración de conexión a SQL Server
    const result = await pool.request()
      .input('email', sql.NVarChar, newUser.Email)
      .input('password', sql.NVarChar, newUser.UsPassword)
      .input('nombre', sql.NVarChar, newUser.UsNombre)
      .query('INSERT INTO Users (Email, UsPassword, UsNombre) VALUES (@email, @password, @nombre)');
    
    return result.rowsAffected[0];
  } catch (error) {
    throw error;
  }
};

module.exports = User;
