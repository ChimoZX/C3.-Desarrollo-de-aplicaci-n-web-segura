import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Send } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({ nombre: '', correo: '' });
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success', msg: string }>({ type: 'idle', msg: '' });

  const validateInput = () => {
    // Validación estricta con expresiones regulares (Sanitización)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.nombre)) {
      return "El nombre solo debe contener letras y tener entre 3 y 40 caracteres.";
    }
    if (!emailRegex.test(formData.correo)) {
      return "El formato del correo electrónico no es válido.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateInput();
    if (validationError) {
      setStatus({ type: 'error', msg: validationError });
      return;
    }

    setStatus({ type: 'idle', msg: '' });

    try {
      // Aquí simulamos el envío al backend donde ocurre la magia anti-SQL Inyection
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Datos procesados y guardados de forma segura.' });
        setFormData({ nombre: '', correo: '' });
      } else {
        setStatus({ type: 'error', msg: 'Error en el servidor.' });
      }
    } catch (error) {
      // Fallback para la demo si no hay backend levantado
      setStatus({ type: 'success', msg: '(Demo) Datos válidos listos para el backend seguro.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-green-400 w-8 h-8" />
          <h2 className="text-2xl font-bold text-white">Registro</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Angel Morales"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            Enviar Datos
          </button>
        </form>

        {/* Notificaciones Animadas con Framer Motion */}
        {status.type !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              status.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'
            }`}
          >
            {status.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <ShieldCheck className="w-5 h-5 shrink-0" />}
            <p className="text-sm">{status.msg}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}