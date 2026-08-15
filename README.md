# Parqueadero Inteligente UTEQ

Aplicación web desarrollada con **React** que simula el funcionamiento de un
estacionamiento inteligente ubicado en la UTEQ, compuesto por **80 espacios**
(4 columnas de 20 espacios cada una). Cada espacio está asociado a un sensor
simulado que reporta su estado en tiempo real a **Firebase Realtime
Database**.

## ¿Qué hace la aplicación?

- **Genera y simula** los 80 sensores del parqueadero mediante un script que
  escribe directamente en Firebase (`src/services/simulacion.js`): crea los
  espacios si no existen y actualiza aleatoriamente algunos sensores cada
  cierto tiempo (distancia, estado y registro histórico).
- **Determina el estado de cada espacio** según la regla:
  `distancia <= 50 cm → ocupado`, `distancia > 50 cm → libre`.
- **Muestra en tiempo real** los 80 espacios en una cuadrícula de 4 columnas,
  con colores según su estado: verde (libre), rojo (ocupado), gris
  (sin información).
- **Calcula y presenta estadísticas**: total de espacios, libres, ocupados y
  porcentaje de disponibilidad.
- Permite **seleccionar cualquier espacio** para ver su detalle (columna,
  número, distancia, ubicación, bounding box) y su **historial de cambios**.
- Muestra la **ubicación del parqueadero en un mapa**, incluyendo el polígono
  real formado por los 4 puntos (P1-P4) que delimitan el terreno.
- Incluye **filtros** por columna y por estado, y una **leyenda de colores**.

## Estructura del proyecto

```
src/
├── components/     # Componentes visuales (tarjetas, cuadrícula, mapa, etc.)
├── hooks/          # Hooks de lectura en tiempo real y de simulación
├── pages/          # Inicio, Estacionamiento, DetalleEspacio
├── services/       # Conexión a Firebase y script de simulación
├── utils/          # Cálculo geométrico de coordenadas por espacio
└── App.jsx
```

## Rutas

| Ruta               | Descripción                                 |
| ------------------- | -------------------------------------------- |
| `/`                 | Página de inicio                             |
| `/estacionamiento`  | Vista general con cuadrícula y estadísticas  |
| `/espacios/:id`     | Detalle e historial de un espacio            |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Una cuenta de [Firebase](https://firebase.google.com/) con un proyecto que
  tenga **Realtime Database** habilitada

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL-del-repositorio>
   cd parqueadero-uteq
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Configurar las variables de entorno. Crear un archivo `.env` en la raíz
   del proyecto con las credenciales de tu proyecto de Firebase:

   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

   Estos valores se obtienen desde la consola de Firebase, en
   **Configuración del proyecto > Tus apps > Configuración del SDK**.

## Ejecución en modo desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

Al abrir la app por primera vez, el script de simulación detecta que la base
de datos está vacía y **genera automáticamente los 80 espacios** en Firebase.
A partir de ahí, cada 8 segundos actualiza aleatoriamente algunos sensores
para simular el uso real del parqueadero.

## Compilar para producción

```bash
npm run build
```

Los archivos listos para desplegar quedan en la carpeta `dist/`.

## Vista previa de la build de producción

```bash
npm run preview
```
