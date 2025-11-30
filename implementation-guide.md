# 📘 Guía de Implementación - Course Platform

## 🗂️ Mapeo de Artifacts a Archivos

### Artifact 1: `db_schema` → Database Schema
**Archivo:** `database/schema.sql` ok
```
Copiar TODO el contenido del artifact "Database Schema - PostgreSQL"
Este archivo contiene toda la estructura de la base de datos.
```

### Artifact 2: `api_design` → API Documentation
**Archivo:** `docs/api-documentation.yaml` (crear carpeta docs/) ok
```
Copiar el contenido del artifact "API Endpoints Documentation"
Usar como referencia para implementar los endpoints.
```

### Artifact 3: `auth_implementation` → Backend Auth
**Archivos a crear:**
- `backend/src/services/auth.service.ts` - Clase AuthService
- `backend/src/middleware/auth.middleware.ts` - Middlewares authenticate y authorize
- `backend/src/routes/auth.routes.ts` - Rutas de autenticación

**Cómo dividir el código:**
```typescript
// ===== ARCHIVO: backend/src/services/auth.service.ts =====
// Copiar SOLO la clase AuthService (líneas 1-150 aprox)

// ===== ARCHIVO: backend/src/middleware/auth.middleware.ts =====
// Copiar los middlewares authenticate y authorize (líneas 150-200 aprox)

// ===== ARCHIVO: backend/src/routes/auth.routes.ts =====
// Copiar las rutas del router (líneas 200-final)
```

### Artifact 4: `course_management` → Backend Courses
**Archivos a crear:**
- `backend/src/services/course.service.ts` - Clase CourseService
- `backend/src/services/module.service.ts` - Clases ModuleService y LessonService
- `backend/src/routes/course.routes.ts` - Rutas de cursos

### Artifact 5: `exam_system` → Backend Exams
**Archivos a crear:**
- `backend/src/services/exam.service.ts` - Clase ExamService
- `backend/src/routes/exam.routes.ts` - Rutas de exámenes

### Artifact 6: `forum_system` → Backend Forum
**Archivos a crear:**
- `backend/src/services/forum.service.ts` - Clase ForumService
- `backend/src/routes/forum.routes.ts` - Rutas del foro

### Artifact 7: `student_dashboard` → Frontend Component
**Archivo:** `frontend/src/components/dashboard/StudentDashboard.tsx`  ok
```
Copiar TODO el componente React
```

### Artifact 8: `video_player` → Frontend Component
**Archivo:** `frontend/src/components/video/VideoPlayer.tsx` ok
```
Copiar TODO el componente React del reproductor
```

### Artifact 9: `docker_config` → Docker Configuration
**Archivos a crear:**
- `docker-compose.yml` - Configuración principal (copiar la primera sección) ---ok pero parece incompleto
- `backend/Dockerfile` - Dockerfile del backend (buscar "# Backend Dockerfile")
- `frontend/Dockerfile` - Dockerfile del frontend (buscar "# Frontend Dockerfile")
- `nginx/nginx.conf` - Configuración de Nginx (buscar "# Nginx Configuration")
- `.env.example` - Variables de entorno (buscar "# Environment Variables Template")

---

## 🔧 Configuración de package.json

### Backend Package.json
**Archivo:** `backend/package.json`

```json
{
  "name": "course-platform-backend",
  "version": "1.0.0",
  "description": "Backend API for Course Management Platform",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "node dist/scripts/migrate.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "slugify": "^1.6.6",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1498.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.9",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

### Frontend Package.json
**Archivo:** `frontend/package.json`

```json
{
  "name": "course-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.4",
    "lucide-react": "^0.300.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.14.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
}
```

---

## 🏗️ Archivos de Configuración Adicionales

### Backend TypeScript Config
**Archivo:** `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Frontend TypeScript Config
**Archivo:** `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Frontend Tailwind Config
**Archivo:** `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Frontend Next.js Config
**Archivo:** `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  },
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
```

---

## 🎯 Archivo Principal del Backend

**Archivo:** `backend/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import examRoutes from './routes/exam.routes';
import forumRoutes from './routes/forum.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/forum', forumRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    statusCode: err.status || 500,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;
```

---

## 🚀 Orden de Implementación Recomendado

### Fase 1: Setup Inicial (30 min)
1. ✅ Ejecutar `setup-project.sh`
2. ✅ Copiar `database/schema.sql`
3. ✅ Configurar `.env` con credenciales
4. ✅ Crear `docker-compose.yml`

### Fase 2: Backend Core (2-3 horas)
1. ✅ Configurar `backend/package.json`
2. ✅ Crear `backend/src/index.ts`
3. ✅ Implementar autenticación (artifact 3)
4. ✅ Implementar gestión de cursos (artifact 4)
5. ✅ Probar con Postman/Thunder Client

### Fase 3: Backend Features (2-3 horas)
1. ✅ Implementar sistema de exámenes (artifact 5)
2. ✅ Implementar foro (artifact 6)
3. ✅ Implementar inscripciones
4. ✅ Probar endpoints

### Fase 4: Frontend Setup (1 hora)
1. ✅ Configurar `frontend/package.json`
2. ✅ Configurar Tailwind y Next.js
3. ✅ Crear layout base

### Fase 5: Frontend Components (3-4 horas)
1. ✅ Implementar autenticación UI
2. ✅ Implementar dashboard de estudiante (artifact 7)
3. ✅ Implementar reproductor de video (artifact 8)
4. ✅ Crear páginas de cursos

### Fase 6: Docker & Deploy (1 hora)
1. ✅ Configurar Dockerfiles
2. ✅ Configurar Nginx
3. ✅ Probar con `docker-compose up`

---

## 🔍 Comandos Útiles

```bash
# Iniciar base de datos
docker-compose up -d postgres redis

# Ver logs
docker-compose logs -f backend

# Ejecutar migraciones
docker-compose exec backend npm run migrate

# Reiniciar servicios
docker-compose restart

# Limpiar todo
docker-compose down -v
```

---

## ✅ Checklist de Verificación

- [ ] Base de datos PostgreSQL funcionando
- [ ] Backend responde en `localhost:3000/health`
- [ ] Puedo registrar un usuario
- [ ] Puedo hacer login y recibo JWT
- [ ] Puedo crear un curso como tutor
- [ ] Frontend carga en `localhost:80`
- [ ] Dashboard de estudiante muestra datos
- [ ] Reproductor de video funciona

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Error: "Port already in use"
```bash
# Cambiar puerto en docker-compose.yml
# O detener el servicio que usa el puerto
sudo lsof -i :3000
```

### Error de permisos en Linux
```bash
# Dar permisos al script
chmod +x setup-project.sh

# Ejecutar con sudo si es necesario
sudo docker-compose up -d
```