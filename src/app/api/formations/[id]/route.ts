import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/formations/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.formation.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Formation no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching formation:', error)
    return errorResponse('Error al obtener formation', 500)
  }
}

// PUT /api/formations/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.formation.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Formation no encontrado', 404)
    }

    const item = await prisma.formation.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating formation:', error)
    return errorResponse(error.message || 'Error al actualizar formation', 500)
  }
}

// DELETE /api/formations/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.formation.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Formation no encontrado', 404)
    }

    await prisma.formation.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Formation eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting formation:', error)
    return errorResponse(error.message || 'Error al eliminar formation', 500)
  }
}
