# Guía de Migración de Firebase a Prisma + PostgreSQL

Esta guía te ayudará a completar la migración de Firebase a Prisma con PostgreSQL.

## 📋 Cambios Realizados

### ✅ Completado

1. **Instalación de dependencias**
   - Prisma y Prisma Client
   - NextAuth.js con adaptador de Prisma
   - bcryptjs para hashing de contraseñas

2. **Esquema de Prisma**
   - Todos los modelos de datos creados (22 colecciones + 2 singletons)
   - Modelos de autenticación (User, Account, Session, VerificationToken)
   - Archivo: `prisma/schema.prisma`

3. **Configuración de autenticación**
   - NextAuth.js configurado
   - Proveedor de credenciales
   - Archivo: `src/lib/auth.ts`
   - API Route: `src/app/api/auth/[...nextauth]/route.ts`

4. **Rutas API**
   - Rutas API RESTful para todas las colecciones
   - Sistema de almacenamiento de archivos local
   - Archivos en: `src/app/api/*`

5. **Utilidades**
   - Cliente de Prisma: `src/lib/prisma.ts`
   - Helpers de API: `src/lib/api-utils.ts`
   - Sistema de storage: `src/lib/storage.ts`

### 🔄 Pendiente

1. **Configurar PostgreSQL**
2. **Ejecutar migraciones de Prisma**
3. **Migrar datos de Firebase a PostgreSQL**
4. **Actualizar servicios del cliente**
5. **Actualizar componentes del Dashboard**
6. **Eliminar dependencias de Firebase**

---

## 🚀 Pasos para Completar la Migración

### Paso 1: Configurar PostgreSQL

Tienes varias opciones:

#### Opción A: PostgreSQL Local

```bash
# En Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar servicio
sudo service postgresql start

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE mbj_db;
CREATE USER mbj_user WITH ENCRYPTED PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE mbj_db TO mbj_user;
\q
```

#### Opción B: Docker

```bash
docker run --name postgres-mbj \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mbj_db \
  -p 5432:5432 \
  -d postgres:15
```

#### Opción C: Servicios en la Nube (Recomendado para producción)

- **Supabase** (incluye PostgreSQL + Storage + Auth): https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **Vercel Postgres**: https://vercel.com/storage/postgres

### Paso 2: Actualizar .env

Actualiza el archivo `.env` con tu URL de PostgreSQL real:

```bash
DATABASE_URL="postgresql://usuario:password@host:puerto/mbj_db?schema=public"

# Ejemplo local:
DATABASE_URL="postgresql://mbj_user:tu_password@localhost:5432/mbj_db?schema=public"

# Ejemplo Supabase:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

También genera un secreto seguro para NextAuth:

```bash
# Generar secreto
openssl rand -base64 32

# Actualizar en .env
NEXTAUTH_SECRET="tu-secreto-generado-aqui"
```

### Paso 3: Ejecutar Migraciones de Prisma

```bash
# Generar migración inicial
npx prisma migrate dev --name init

# Esto creará las tablas en tu base de datos
```

### Paso 4: Poblar Base de Datos con Usuarios Iniciales

Primero, añade el script de seed al `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node scripts/seed.ts"
  }
}
```

Luego ejecuta:

```bash
# Ejecutar seed
npx prisma db seed
```

Esto creará:
- Usuario admin: `jordan@mbj.com` / `jordan10`
- Usuario sajor: `sajor@mbj.com` / `S1ndr2J1rd2n`

### Paso 5: Migrar Datos de Firebase a PostgreSQL

Crea un script para migrar tus datos existentes de Firebase:

```bash
# Ejecutar script de migración (cuando lo creemos)
npx ts-node scripts/migrate-firebase-data.ts
```

### Paso 6: Actualizar Servicios del Cliente

Los servicios en `src/services/` necesitan ser actualizados para usar las APIs en lugar de Firestore directamente.

Ejemplo de cambio:

**Antes (Firebase):**
```typescript
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function getProjects() {
  const snapshot = await getDocs(collection(db, 'projects'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

**Después (API):**
```typescript
export async function getProjects() {
  const response = await fetch('/api/projects')
  if (!response.ok) throw new Error('Error al obtener proyectos')
  return response.json()
}
```

### Paso 7: Actualizar Dashboard

El Dashboard en `src/app/core/dashboard/page.tsx` necesita:
1. Reemplazar llamadas a Firestore con llamadas a las APIs
2. Actualizar autenticación para usar NextAuth
3. Reemplazar `onSnapshot` con polling o usar React Query

### Paso 8: Testing

```bash
# Iniciar servidor de desarrollo
npm run dev

# Probar endpoints
curl http://localhost:9002/api/projects
curl -X POST http://localhost:9002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

### Paso 9: Eliminar Firebase

Una vez que todo funcione correctamente:

```bash
# Remover dependencias de Firebase
npm uninstall firebase

# Eliminar archivos de Firebase
rm src/lib/firebase.ts
# (y cualquier otro archivo relacionado con Firebase)
```

---

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── api/                    # Rutas API
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth
│   │   │   └── register/       # Registro
│   │   ├── projects/
│   │   ├── services/
│   │   └── ...                 # Todas las colecciones
│   └── core/
│       ├── login/              # Página de login (actualizar)
│       └── dashboard/          # Dashboard (actualizar)
├── lib/
│   ├── prisma.ts               # Cliente Prisma
│   ├── auth.ts                 # Configuración NextAuth
│   ├── api-utils.ts            # Helpers de API
│   └── storage.ts              # Sistema de archivos
└── services/                   # Servicios del cliente (actualizar)
    ├── projects.ts
    ├── services.ts
    └── ...

prisma/
├── schema.prisma               # Esquema de base de datos
└── migrations/                 # Migraciones (se generan)

scripts/
├── generate-api-routes.ts      # Generador de APIs
└── seed.ts                     # Seed de DB

public/
└── uploads/                    # Almacenamiento de archivos
    ├── projects/
    ├── services/
    └── ...
```

---

## 🔐 Autenticación

### Login con NextAuth

```typescript
import { signIn } from 'next-auth/react'

await signIn('credentials', {
  email: 'jordan@mbj.com',
  password: 'jordan10',
  callbackUrl: '/core/dashboard'
})
```

### Obtener Sesión

```typescript
// En componente del cliente
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Cargando...</div>
  if (!session) return <div>No autenticado</div>

  return <div>Hola {session.user.name}</div>
}

// En Server Component
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function MyServerComponent() {
  const session = await getServerSession(authOptions)
  // ...
}
```

---

## 📊 Endpoints Disponibles

Todos los endpoints siguen el patrón RESTful:

```
GET    /api/{collection}       - Listar todos
GET    /api/{collection}/{id}  - Obtener uno
POST   /api/{collection}       - Crear nuevo
PUT    /api/{collection}/{id}  - Actualizar
DELETE /api/{collection}/{id}  - Eliminar

# Excepciones (singletons):
GET    /api/hero-content       - Obtener
PUT    /api/hero-content       - Actualizar

GET    /api/about-content      - Obtener
PUT    /api/about-content      - Actualizar
```

### Colecciones disponibles:
- `/api/projects`
- `/api/services`
- `/api/notes`
- `/api/git-protocols`
- `/api/protocols`
- `/api/aprende-pages`
- `/api/images`
- `/api/prompts`
- `/api/n8n-templates`
- `/api/n8n-servers`
- `/api/designs`
- `/api/htmls`
- `/api/links`
- `/api/link-cards`
- `/api/blog-categories`
- `/api/formations`
- `/api/shorts`
- `/api/tools`
- `/api/tool-categories`
- `/api/sajor`
- `/api/hero-content`
- `/api/about-content`

---

## 🛠️ Comandos Útiles de Prisma

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (GUI para ver datos)
npx prisma studio

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset

# Formatear schema
npx prisma format
```

---

## 🐛 Troubleshooting

### Error: Cannot find module '@prisma/client'
```bash
npx prisma generate
```

### Error de conexión a PostgreSQL
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que el puerto 5432 esté abierto

### Error: Prisma Client initialization
```bash
npm install @prisma/client
npx prisma generate
```

---

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth.js](https://next-auth.js.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🚨 Importante

**Antes de eliminar Firebase:**
1. Exporta todos tus datos de Firestore
2. Descarga todas las imágenes de Firebase Storage
3. Haz un backup completo
4. Verifica que todos los datos se migraron correctamente

**Seguridad:**
1. Cambia el `NEXTAUTH_SECRET` en producción
2. Usa HTTPS en producción
3. Configura CORS apropiadamente
4. Implementa rate limiting
5. Valida todos los inputs del usuario
