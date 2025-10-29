import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/links/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.linkitem.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('LinkItem no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching linkitem:', error)
    return errorResponse('Error al obtener linkitem', 500)
  }
}

// PUT /api/links/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.linkitem.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('LinkItem no encontrado', 404)
    }

    const item = await prisma.linkitem.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating linkitem:', error)
    return errorResponse(error.message || 'Error al actualizar linkitem', 500)
  }
}

// DELETE /api/links/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.linkitem.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('LinkItem no encontrado', 404)
    }

    await prisma.linkitem.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'LinkItem eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting linkitem:', error)
    return errorResponse(error.message || 'Error al eliminar linkitem', 500)
  }
}
