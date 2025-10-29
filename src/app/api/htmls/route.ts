import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/htmls - Obtener todos
export async function GET() {
  try {
    const items = await prisma.htmlpage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(items)
  } catch (error) {
    console.error('Error fetching htmlpages:', error)
    return errorResponse('Error al obtener htmlpages', 500)
  }
}

// POST /api/htmls - Crear nuevo
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ["title","htmlContent"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`El campo ${field} es requerido`)
      }
    }


    const item = await prisma.htmlpage.create({
      data: body
    })

    return successResponse(item, 201)
  } catch (error: any) {
    console.error('Error creating htmlpage:', error)
    return errorResponse(error.message || 'Error al crear htmlpage', 500)
  }
}
