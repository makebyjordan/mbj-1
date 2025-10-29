import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/aprende-pages/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.aprendepage.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('AprendePage no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching aprendepage:', error)
    return errorResponse('Error al obtener aprendepage', 500)
  }
}

// PUT /api/aprende-pages/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.aprendepage.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('AprendePage no encontrado', 404)
    }

    const item = await prisma.aprendepage.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating aprendepage:', error)
    return errorResponse(error.message || 'Error al actualizar aprendepage', 500)
  }
}

// DELETE /api/aprende-pages/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.aprendepage.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('AprendePage no encontrado', 404)
    }

    await prisma.aprendepage.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'AprendePage eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting aprendepage:', error)
    return errorResponse(error.message || 'Error al eliminar aprendepage', 500)
  }
}
