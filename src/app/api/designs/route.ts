import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/designs - Obtener todos
export async function GET() {
  try {
    const items = await prisma.design.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching designs:', error)
    return errorResponse('Error al obtener designs', 500)
  }
}

// POST /api/designs - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["title"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    // Manejar imagen base64
    if (body.imageUrl && isBase64Image(body.imageUrl)) {
      body.imageUrl = await saveBase64Image(body.imageUrl, 'designs')
    }

    const item = await prisma.design.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating design:', error)
    return errorResponse(error.message || 'Error al crear design', 500)
  }
}
