import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/git-protocols/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.gitprotocol.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('GitProtocol no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching gitprotocol:', error)
    return errorResponse('Error al obtener gitprotocol', 500)
  }
}

// PUT /api/git-protocols/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.gitprotocol.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('GitProtocol no encontrado', 404)
    }

    const item = await prisma.gitprotocol.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating gitprotocol:', error)
    return errorResponse(error.message || 'Error al actualizar gitprotocol', 500)
  }
}

// DELETE /api/git-protocols/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.gitprotocol.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('GitProtocol no encontrado', 404)
    }

    await prisma.gitprotocol.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'GitProtocol eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting gitprotocol:', error)
    return errorResponse(error.message || 'Error al eliminar gitprotocol', 500)
  }
}
