import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombre, correo } = req.body;

  // 1. Doble validación (Backend)
  if (!nombre || !correo) {
    return res.status(400).json({ error: "Faltan datos." });
  }

  // 2. Protección contra Inyección SQL
  const db = new sqlite3.Database(':memory:');
  
  // Creamos la tabla temporal
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nombre TEXT, correo TEXT)`);

  // CONSULTA PARAMETRIZADA: Los signos '?' evitan que código SQL malicioso se ejecute
  const sql = `INSERT INTO usuarios (nombre, correo) VALUES (?, ?)`;
  
  db.run(sql, [nombre, correo], function(err) {
    if (err) {
      return res.status(500).json({ error: "Error en la base de datos." });
    }
    res.status(200).json({ 
      success: true, 
      message: "Usuario registrado de forma segura. ¡Inyección SQL prevenida!" 
    });
  });
}