import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/protocols/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.protocol.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Protocol no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching protocol:', error)
    return errorResponse('Error al obtener protocol', 500)
  }
}

// PUT /api/protocols/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.protocol.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Protocol no encontrado', 404)
    }

    const item = await prisma.protocol.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating protocol:', error)
    return errorResponse(error.message || 'Error al actualizar protocol', 500)
  }
}

// DELETE /api/protocols/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.protocol.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Protocol no encontrado', 404)
    }

    await prisma.protocol.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Protocol eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting protocol:', error)
    return errorResponse(error.message || 'Error al eliminar protocol', 500)
  }
}
