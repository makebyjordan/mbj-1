import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/projects - Obtener todos los proyectos
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })

    return successResponse(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return errorResponse('Error al obtener proyectos', 500)
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { title, description, imageUrl, url, type, htmlContent, categoryId } = body

    if (!title || !description) {
      return errorResponse('Título y descripción son requeridos')
    }

    // Manejar imagen base64
    let finalImageUrl = imageUrl
    if (imageUrl && isBase64Image(imageUrl)) {
      finalImageUrl = await saveBase64Image(imageUrl, 'projects')
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: finalImageUrl,
        url,
        type: type || 'project',
        htmlContent,
        categoryId
      },
      include: {
        category: true
      }
    })

    return successResponse(project, 201)
  } catch (error: any) {
    console.error('Error creating project:', error)
    return errorResponse(error.message || 'Error al crear proyecto', 500)
  }
}
