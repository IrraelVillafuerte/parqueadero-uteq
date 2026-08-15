import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Activity } from 'lucide-react';

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Sistema de Parqueadero Inteligente UTEQ
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Monitoreo telemático en tiempo real con 80 sensores ultrasónicos desplegados en el Campus Quevedo.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 text-left text-xs bg-gray-50 p-4 rounded-xl">
          <div>
            <Car className="w-4 h-4 text-green-700 mb-1" />
            <span className="font-bold block text-gray-800">Capacidad</span>
            <span className="text-gray-500">80 plazas</span>
          </div>
          <div>
            <Activity className="w-4 h-4 text-green-700 mb-1" />
            <span className="font-bold block text-gray-800">Organización</span>
            <span className="text-gray-500">4 col. × 20 filas</span>
          </div>
          <div>
            <ShieldCheck className="w-4 h-4 text-green-700 mb-1" />
            <span className="font-bold block text-gray-800">Base de datos</span>
            <span className="text-gray-500">Firebase RTDB</span>
          </div>
        </div>
        <Link
          to="/estacionamiento"
          className="inline-block bg-green-800 hover:bg-green-900 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
        >
          Ingresar al Panel Operativo
        </Link>
      </div>
    </div>
  );
}