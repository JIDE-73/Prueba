# Prueba - API Backend

Este proyecto es una prueba de API utilizando Prisma con la versión más reciente.

## Descripción

Una API backend construida con Node.js, TypeScript, Express y Prisma para gestión de base de datos PostgreSQL.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm
- PostgreSQL (base de datos)

## Instalación

1. Clona el repositorio o descarga los archivos del proyecto.

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura la base de datos:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Agrega la variable de entorno `DATABASE_URL` con la URL de conexión a tu base de datos PostgreSQL.
     Ejemplo:
     ```
     DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
     ```
   - Opcionalmente, configura `PORT` si deseas un puerto diferente al 3000.

## Configuración de Prisma

1. Genera el cliente de Prisma:
   ```
   npx prisma generate
   ```

2. Ejecuta las migraciones para crear las tablas en la base de datos:
   ```
   npx prisma migrate dev
   ```

## Ejecución

### Modo Desarrollo
Para ejecutar el servidor en modo desarrollo (con recarga automática):
```
npm run dev
```

### Modo Producción
Para ejecutar el servidor en modo producción:
```
npm start
```

El servidor se iniciará en el puerto configurado (por defecto 3000). Podrás acceder a la API en `http://localhost:3000`.

## Estructura del Proyecto

- `index.ts`: Punto de entrada de la aplicación Express.
- `prisma/schema.prisma`: Esquema de la base de datos con modelos User, Person, Course, etc.
- `package.json`: Dependencias y scripts del proyecto.

## Notas

- Asegúrate de que la base de datos PostgreSQL esté ejecutándose antes de iniciar el servidor.
- Las migraciones de Prisma crearán las tablas necesarias en la base de datos.