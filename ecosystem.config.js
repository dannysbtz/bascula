require('dotenv').config(); // Cargar variables de .env

module.exports = {
  apps: [
    {
      name: "index",
      script: "./src/index.js", // Ruta a tu archivo principal
      env: {
        PORT: process.env.PORT || 3000,
        MONGODB_URI: process.env.MONGODB_URI,
        // Otras variables de entorno si es necesario
      },
      env_production: {
        PORT: process.env.PORT || 3000,
        MONGODB_URI: process.env.MONGODB_URI,
        // Otras variables para producción
      },
    },
  ],
};