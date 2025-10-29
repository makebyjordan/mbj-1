import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/services - Obtener todos
export async function GET() {
  try {
    const items = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching services:', error)
    return errorResponse('Error al obtener services', 500)
  }
}

// POST /api/services - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["title","description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    // Manejar imagen base64
    if (body.iconUrl && isBase64Image(body.iconUrl)) {
      body.iconUrl = await saveBase64Image(body.iconUrl, 'services')
    }

    const item = await prisma.service.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating service:', error)
    return errorResponse(error.message || 'Error al crear service', 500)
  }
}
