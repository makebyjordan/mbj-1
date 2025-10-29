# MBJ-1 - Migración a Prisma + PostgreSQL

Este proyecto ha sido migrado de Firebase (Firestore + Storage) a Prisma con PostgreSQL y NextAuth.js.

## 🎯 Resumen de Cambios

### Antes (Firebase)
- **Base de datos**: Firestore (NoSQL)
- **Autenticación**: Códigos hardcoded sin sistema real
- **Storage**: Firebase Storage
- **Arquitectura**: Todo del lado del cliente

### Ahora (Prisma + PostgreSQL)
- **Base de datos**: PostgreSQL (SQL) con Prisma ORM
- **Autenticación**: NextAuth.js con JWT y bcrypt
- **Storage**: Sistema de archivos local (fácilmente reemplazable por S3/Cloudinary)
- **Arquitectura**: API REST en Next.js con autenticación

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar PostgreSQL

Elige una de estas opciones:

**Opción A: Docker (Recomendado para desarrollo)**
```bash
docker run --name postgres-mbj \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mbj_db \
  -p 5432:5432 \
  -d postgres:15
```

**Opción B: Supabase (Recomendado para producción)**
1. Crea una cuenta en https://supabase.com
2. Crea un nuevo proyecto
3. Copia la connection string de PostgreSQL

**Opción C: Local**
```bash
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres psql
CREATE DATABASE mbj_db;
\q
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y actualiza:

```bash
# Actualiza con tu URL real de PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/mbj_db?schema=public"

# Genera un secreto seguro
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 4. Ejecutar migraciones

```bash
# Generar cliente Prisma
npm run prisma:generate

# Crear tablas en la base de datos
npm run prisma:migrate

# Poblar con usuarios iniciales
npm run db:seed
```

### 5. (Opcional) Migrar datos de Firebase

Si tienes datos existentes en Firebase:

```bash
npm run migrate:firebase
```

### 6. Iniciar servidor

```bash
npm run dev
```

La aplicación estará en http://localhost:9002

## 📚 Documentación

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guía completa de migración
- **[Prisma Schema](./prisma/schema.prisma)** - Esquema de base de datos
- **[API Routes](./src/app/api/)** - Documentación de endpoints

## 🔐 Autenticación

### Usuarios por defecto (después del seed)

- **Admin**: `jordan@mbj.com` / `jordan10`
- **Sajor**: `sajor@mbj.com` / `S1ndr2J1rd2n`

### Login

```typescript
import { signIn } from 'next-auth/react'

await signIn('credentials', {
  email: 'jordan@mbj.com',
  password: 'jordan10',
  callbackUrl: '/core/dashboard'
})
```

### Obtener sesión

```typescript
// Client Component
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session } = useSession()
  // ...
}

// Server Component
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function MyServerComponent() {
  const session = await getServerSession(authOptions)
  // ...
}
```

## 🛣️ API Endpoints

Todas las APIs siguen el patrón RESTful:

```
GET    /api/{collection}       - Listar todos
GET    /api/{collection}/{id}  - Obtener uno
POST   /api/{collection}       - Crear (requiere auth)
PUT    /api/{collection}/{id}  - Actualizar (requiere auth)
DELETE /api/{collection}/{id}  - Eliminar (requiere auth)
```

### Colecciones disponibles

- `/api/projects` - Proyectos y blogs
- `/api/blog-categories` - Categorías de blog
- `/api/services` - Servicios
- `/api/notes` - Notas
- `/api/git-protocols` - Protocolos Git
- `/api/protocols` - Protocolos generales
- `/api/aprende-pages` - Páginas educativas
- `/api/images` - Galería de imágenes
- `/api/prompts` - Prompts de IA
- `/api/n8n-templates` - Plantillas n8n
- `/api/n8n-servers` - Servidores n8n
- `/api/designs` - Diseños
- `/api/htmls` - Páginas HTML
- `/api/links` - Enlaces
- `/api/link-cards` - Tarjetas de enlaces
- `/api/formations` - Formaciones
- `/api/shorts` - Videos cortos
- `/api/tools` - Herramientas
- `/api/tool-categories` - Categorías de herramientas
- `/api/sajor` - Items Sajor
- `/api/hero-content` - Contenido hero (singleton)
- `/api/about-content` - Contenido about (singleton)

### Autenticación

```
POST /api/auth/register    - Registrar usuario
POST /api/auth/signin      - Iniciar sesión (NextAuth)
POST /api/auth/signout     - Cerrar sesión (NextAuth)
```

## 📁 Estructura del Proyecto

```
mbj-1/
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   └── migrations/             # Migraciones (autogeneradas)
│
├── src/
│   ├── app/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/  # NextAuth
│   │   │   │   └── register/       # Registro
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   └── ...             # Todas las colecciones
│   │   │
│   │   ├── core/
│   │   │   ├── login/          # Página login (actualizar)
│   │   │   └── dashboard/      # Dashboard (actualizar)
│   │   │
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── prisma.ts           # Cliente Prisma
│   │   ├── auth.ts             # Configuración NextAuth
│   │   ├── api-utils.ts        # Helpers API
│   │   └── storage.ts          # Sistema archivos
│   │
│   └── services/               # Servicios cliente (actualizar)
│       ├── projects.ts
│       ├── services.ts
│       └── ...
│
├── scripts/
│   ├── generate-api-routes.ts  # Generador de APIs
│   ├── seed.ts                 # Seed de DB
│   └── migrate-firebase-data.ts # Migración Firebase
│
├── public/
│   └── uploads/                # Storage local
│       ├── projects/
│       ├── services/
│       └── ...
│
├── .env                        # Variables de entorno
├── .env.example               # Ejemplo de .env
├── MIGRATION_GUIDE.md         # Guía detallada
└── README_PRISMA.md           # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor dev

# Prisma
npm run prisma:generate     # Generar cliente Prisma
npm run prisma:migrate      # Crear migración
npm run prisma:studio       # Abrir Prisma Studio (GUI)

# Base de datos
npm run db:seed             # Poblar DB con datos iniciales
npm run migrate:firebase    # Migrar datos de Firebase

# Build
npm run build               # Build para producción
npm run start               # Iniciar en producción

# Otros
npm run lint                # Linter
npm run typecheck           # TypeScript check
```

## 📊 Prisma Studio

Para ver y editar datos visualmente:

```bash
npm run prisma:studio
```

Se abrirá en http://localhost:5555

## 🔄 Próximos Pasos

### Si acabas de clonar el proyecto:

1. ✅ Instalar dependencias
2. ✅ Configurar PostgreSQL
3. ✅ Configurar .env
4. ✅ Ejecutar migraciones
5. ✅ Ejecutar seed
6. ✅ Iniciar servidor

### Si estás migrando desde Firebase:

1. ✅ Completar pasos de arriba
2. ⚠️ Ejecutar migración de datos: `npm run migrate:firebase`
3. ⚠️ Actualizar servicios del cliente (ver MIGRATION_GUIDE.md)
4. ⚠️ Actualizar Dashboard (ver MIGRATION_GUIDE.md)
5. ⚠️ Probar toda la aplicación
6. ⚠️ Eliminar Firebase cuando todo funcione

## 🐛 Troubleshooting

### Error: Cannot find module '@prisma/client'
```bash
npm run prisma:generate
```

### Error de conexión a PostgreSQL
1. Verifica que PostgreSQL esté corriendo
2. Verifica DATABASE_URL en .env
3. Verifica que el puerto 5432 esté abierto

### Tablas no existen
```bash
npm run prisma:migrate
```

### Datos de seed ya existen
Es normal, el script detecta duplicados y los omite.

## 📖 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🚨 Importante

### Antes de eliminar Firebase:

1. ✅ Exporta todos los datos de Firestore
2. ✅ Descarga todas las imágenes de Storage
3. ✅ Haz backup completo
4. ✅ Verifica que todos los datos migraron correctamente
5. ✅ Prueba toda la funcionalidad

### Seguridad en producción:

1. ✅ Cambia NEXTAUTH_SECRET
2. ✅ Usa HTTPS
3. ✅ Configura CORS apropiadamente
4. ✅ Implementa rate limiting
5. ✅ Valida todos los inputs
6. ✅ Usa variables de entorno seguras
7. ✅ Habilita SSL en PostgreSQL

## 📝 Licencia

Proyecto privado - Todos los derechos reservados

## 👤 Autor

Jordan - MBJ

---

Para más detalles, ver [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
