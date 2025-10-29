import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/git-protocols - Obtener todos
export async function GET() {
  try {
    const items = await prisma.gitprotocol.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching gitprotocols:', error)
    return errorResponse('Error al obtener gitprotocols', 500)
  }
}

// POST /api/git-protocols - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["title","steps"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    const item = await prisma.gitprotocol.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating gitprotocol:', error)
    return errorResponse(error.message || 'Error al crear gitprotocol', 500)
  }
}
