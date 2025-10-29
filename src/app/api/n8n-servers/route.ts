import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/n8n-servers - Obtener todos
export async function GET() {
  try {
    const items = await prisma.n8nserver.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching n8nservers:', error)
    return errorResponse('Error al obtener n8nservers', 500)
  }
}

// POST /api/n8n-servers - Crear nuevo
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


    const item = await prisma.n8nserver.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating n8nserver:', error)
    return errorResponse(error.message || 'Error al crear n8nserver', 500)
  }
}
