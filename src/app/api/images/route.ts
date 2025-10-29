import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/images - Obtener todos
export async function GET() {
  try {
    const items = await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching images:', error)
    return errorResponse('Error al obtener images', 500)
  }
}

// POST /api/images - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["name","url"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    // Manejar imagen base64
    if (body.url && isBase64Image(body.url)) {
      body.url = await saveBase64Image(body.url, 'gallery')
    }

    const item = await prisma.image.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating image:', error)
    return errorResponse(error.message || 'Error al crear image', 500)
  }
}
