import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: "Faltan datos." });
  }

  const db = new sqlite3.Database(':memory:');
  
  // db.serialize asegura que las instrucciones se ejecuten en orden estricto
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nombre TEXT, correo TEXT)`);

    // CONSULTA PARAMETRIZADA: Los signos '?' evitan la inyección SQL
    const sql = `INSERT INTO usuarios (nombre, correo) VALUES (?, ?)`;
    
    db.run(sql, [nombre, correo], function(err) {
      if (err) {
        // Ahora nos dirá exactamente cuál es el error si vuelve a fallar
        return res.status(500).json({ error: "Error en la base de datos: " + err.message });
      }
      res.status(200).json({ 
        success: true, 
        message: "Usuario registrado de forma segura. ¡Inyección SQL prevenida!" 
      });
    });
  });
}