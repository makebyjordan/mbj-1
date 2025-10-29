import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/aprende-pages - Obtener todos
export async function GET() {
  try {
    const items = await prisma.aprendepage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching aprendepages:', error)
    return errorResponse('Error al obtener aprendepages', 500)
  }
}

// POST /api/aprende-pages - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["title","code"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    const item = await prisma.aprendepage.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating aprendepage:', error)
    return errorResponse(error.message || 'Error al crear aprendepage', 500)
  }
}
