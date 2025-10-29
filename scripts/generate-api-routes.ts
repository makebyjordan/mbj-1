/**
 * Script para generar rutas API para todas las colecciones
 * Ejecutar con: npx ts-node scripts/generate-api-routes.ts
 */

import fs from 'fs'
import path from 'path'

interface RouteConfig {
  name: string // Nombre del modelo en Prisma
  apiPath: string // Ruta de la API
  hasImage: boolean // Si tiene campo de imagen
  imageFolder?: string // Carpeta para guardar imágenes
  imageField?: string // Nombre del campo de imagen
  requiredFields?: string[] // Campos requeridos
  singleton?: boolean // Si es un documento singleton
}

const routes: RouteConfig[] = [
  {
    name: 'Service',
    apiPath: 'services',
    hasImage: true,
    imageFolder: 'services',
    imageField: 'iconUrl',
    requiredFields: ['title', 'description']
  },
  {
    name: 'Note',
    apiPath: 'notes',
    hasImage: false,
    requiredFields: ['title', 'description']
  },
  {
    name: 'GitProtocol',
    apiPath: 'git-protocols',
    hasImage: false,
    requiredFields: ['title', 'steps']
  },
  {
    name: 'Protocol',
    apiPath: 'protocols',
    hasImage: false,
    requiredFields: ['title', 'steps']
  },
  {
    name: 'Image',
    apiPath: 'images',
    hasImage: true,
    imageFolder: 'gallery',
    imageField: 'url',
    requiredFields: ['name', 'url']
  },
  {
    name: 'Prompt',
    apiPath: 'prompts',
    hasImage: false,
    requiredFields: ['title', 'promptText']
  },
  {
    name: 'N8NTemplate',
    apiPath: 'n8n-templates',
    hasImage: false,
    requiredFields: ['title']
  },
  {
    name: 'N8NServer',
    apiPath: 'n8n-servers',
    hasImage: false,
    requiredFields: ['title']
  },
  {
    name: 'Design',
    apiPath: 'designs',
    hasImage: true,
    imageFolder: 'designs',
    imageField: 'imageUrl',
    requiredFields: ['title']
  },
  {
    name: 'HtmlPage',
    apiPath: 'htmls',
    hasImage: false,
    requiredFields: ['title', 'htmlContent']
  },
  {
    name: 'LinkCard',
    apiPath: 'link-cards',
    hasImage: true,
    imageFolder: 'link-cards',
    imageField: 'imageUrl',
    requiredFields: ['title']
  },
  {
    name: 'LinkItem',
    apiPath: 'links',
    hasImage: false,
    requiredFields: ['title', 'url']
  },
  {
    name: 'BlogCategory',
    apiPath: 'blog-categories',
    hasImage: true,
    imageFolder: 'blog-categories',
    imageField: 'imageUrl',
    requiredFields: ['title']
  },
  {
    name: 'Formation',
    apiPath: 'formations',
    hasImage: false,
    requiredFields: ['title']
  },
  {
    name: 'Short',
    apiPath: 'shorts',
    hasImage: false,
    requiredFields: ['title', 'youtubeUrl']
  },
  {
    name: 'ToolCategory',
    apiPath: 'tool-categories',
    hasImage: false,
    requiredFields: ['name']
  },
  {
    name: 'Tool',
    apiPath: 'tools',
    hasImage: true,
    imageFolder: 'tools',
    imageField: 'imageUrl',
    requiredFields: ['title']
  },
  {
    name: 'SajorItem',
    apiPath: 'sajor',
    hasImage: false,
    requiredFields: ['title']
  },
  {
    name: 'AprendePage',
    apiPath: 'aprende-pages',
    hasImage: false,
    requiredFields: ['title', 'code']
  },
  {
    name: 'HeroContent',
    apiPath: 'hero-content',
    hasImage: true,
    imageFolder: 'hero',
    imageField: 'backgroundImageUrl',
    singleton: true
  },
  {
    name: 'AboutContent',
    apiPath: 'about-content',
    hasImage: true,
    imageFolder: 'about',
    imageField: 'imageUrl',
    singleton: true
  }
]

function generateListRoute(config: RouteConfig): string {
  const modelName = config.name.toLowerCase()
  const ModelName = config.name

  if (config.singleton) {
    return `import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
${config.hasImage ? `import { saveBase64Image, deleteImage } from "@/lib/storage"` : ''}

// GET /api/${config.apiPath} - Obtener contenido singleton
export async function GET() {
  try {
    const content = await prisma.${modelName}.findUnique({
      where: { id: '${modelName}_singleton' }
    })

    return successResponse(content || {})
  } catch (error) {
    console.error('Error fetching ${modelName}:', error)
    return errorResponse('Error al obtener ${modelName}', 500)
  }
}

// PUT /api/${config.apiPath} - Actualizar contenido singleton
export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
${config.hasImage && config.imageField ? `
    // Manejar imagen base64
    let finalImageUrl = body.${config.imageField}
    if (body.${config.imageField} && isBase64Image(body.${config.imageField})) {
      const existing = await prisma.${modelName}.findUnique({
        where: { id: '${modelName}_singleton' }
      })

      if (existing?.${config.imageField}) {
        await deleteImage(existing.${config.imageField})
      }

      finalImageUrl = await saveBase64Image(body.${config.imageField}, '${config.imageFolder}')
      body.${config.imageField} = finalImageUrl
    }
` : ''}
    const content = await prisma.${modelName}.upsert({
      where: { id: '${modelName}_singleton' },
      update: body,
      create: { id: '${modelName}_singleton', ...body }
    })

    return successResponse(content)
  } catch (error: any) {
    console.error('Error updating ${modelName}:', error)
    return errorResponse(error.message || 'Error al actualizar ${modelName}', 500)
  }
}
`
  }

  return `import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
${config.hasImage ? `import { saveBase64Image, deleteImage } from "@/lib/storage"` : ''}

// GET /api/${config.apiPath} - Obtener todos
export async function GET() {
  try {
    const items = await prisma.${modelName}.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching ${modelName}s:', error)
    return errorResponse('Error al obtener ${modelName}s', 500)
  }
}

// POST /api/${config.apiPath} - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
${config.requiredFields ? `
    // Validar campos requeridos
    const requiredFields = ${JSON.stringify(config.requiredFields)}
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(\`El campo \${field} es requerido\`)
      }
    }
` : ''}
${config.hasImage && config.imageField ? `
    // Manejar imagen base64
    if (body.${config.imageField} && isBase64Image(body.${config.imageField})) {
      body.${config.imageField} = await saveBase64Image(body.${config.imageField}, '${config.imageFolder}')
    }
` : ''}
    const item = await prisma.${modelName}.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating ${modelName}:', error)
    return errorResponse(error.message || 'Error al crear ${modelName}', 500)
  }
}
`
}

function generateDetailRoute(config: RouteConfig): string {
  const modelName = config.name.toLowerCase()
  const ModelName = config.name

  return `import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
${config.hasImage ? `import { saveBase64Image, deleteImage } from "@/lib/storage"` : ''}

// GET /api/${config.apiPath}/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.${modelName}.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('${ModelName} no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching ${modelName}:', error)
    return errorResponse('Error al obtener ${modelName}', 500)
  }
}

// PUT /api/${config.apiPath}/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.${modelName}.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('${ModelName} no encontrado', 404)
    }
${config.hasImage && config.imageField ? `
    // Manejar imagen base64
    if (body.${config.imageField} && isBase64Image(body.${config.imageField})) {
      if (existing.${config.imageField}) {
        await deleteImage(existing.${config.imageField})
      }
      body.${config.imageField} = await saveBase64Image(body.${config.imageField}, '${config.imageFolder}')
    }
` : ''}
    const item = await prisma.${modelName}.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating ${modelName}:', error)
    return errorResponse(error.message || 'Error al actualizar ${modelName}', 500)
  }
}

// DELETE /api/${config.apiPath}/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.${modelName}.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('${ModelName} no encontrado', 404)
    }
${config.hasImage && config.imageField ? `
    // Eliminar imagen si existe
    if (item.${config.imageField}) {
      await deleteImage(item.${config.imageField})
    }
` : ''}
    await prisma.${modelName}.delete({
      where: { id: params.id }
    })

    return successResponse({ message: '${ModelName} eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting ${modelName}:', error)
    return errorResponse(error.message || 'Error al eliminar ${modelName}', 500)
  }
}
`
}

function generateRoutes() {
  const apiDir = path.join(process.cwd(), 'src', 'app', 'api')

  for (const config of routes) {
    const routeDir = path.join(apiDir, config.apiPath)

    // Crear directorio si no existe
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true })
    }

    // Generar route.ts (lista)
    const listRoute = generateListRoute(config)
    fs.writeFileSync(path.join(routeDir, 'route.ts'), listRoute)
    console.log(`✅ Generado: /api/${config.apiPath}/route.ts`)

    // Generar [id]/route.ts si no es singleton
    if (!config.singleton) {
      const detailDir = path.join(routeDir, '[id]')
      if (!fs.existsSync(detailDir)) {
        fs.mkdirSync(detailDir, { recursive: true })
      }

      const detailRoute = generateDetailRoute(config)
      fs.writeFileSync(path.join(detailDir, 'route.ts'), detailRoute)
      console.log(`✅ Generado: /api/${config.apiPath}/[id]/route.ts`)
    }
  }

  console.log('\n✨ Todas las rutas API han sido generadas!')
}

generateRoutes()
