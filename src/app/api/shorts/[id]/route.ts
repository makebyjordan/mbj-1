import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/shorts/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.short.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Short no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching short:', error)
    return errorResponse('Error al obtener short', 500)
  }
}

// PUT /api/shorts/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.short.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Short no encontrado', 404)
    }

    const item = await prisma.short.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating short:', error)
    return errorResponse(error.message || 'Error al actualizar short', 500)
  }
}

// DELETE /api/shorts/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.short.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Short no encontrado', 404)
    }

    await prisma.short.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Short eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting short:', error)
    return errorResponse(error.message || 'Error al eliminar short', 500)
  }
}
