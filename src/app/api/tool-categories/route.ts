import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/tool-categories - Obtener todos
export async function GET() {
  try {
    const items = await prisma.toolcategory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching toolcategorys:', error)
    return errorResponse('Error al obtener toolcategorys', 500)
  }
}

// POST /api/tool-categories - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["name"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    const item = await prisma.toolcategory.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating toolcategory:', error)
    return errorResponse(error.message || 'Error al crear toolcategory', 500)
  }
}
