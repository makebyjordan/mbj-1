import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/htmls/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.htmlpage.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('HtmlPage no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching htmlpage:', error)
    return errorResponse('Error al obtener htmlpage', 500)
  }
}

// PUT /api/htmls/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.htmlpage.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('HtmlPage no encontrado', 404)
    }

    const item = await prisma.htmlpage.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating htmlpage:', error)
    return errorResponse(error.message || 'Error al actualizar htmlpage', 500)
  }
}

// DELETE /api/htmls/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.htmlpage.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('HtmlPage no encontrado', 404)
    }

    await prisma.htmlpage.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'HtmlPage eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting htmlpage:', error)
    return errorResponse(error.message || 'Error al eliminar htmlpage', 500)
  }
}
