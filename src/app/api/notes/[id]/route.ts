import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/notes/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.note.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Note no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching note:', error)
    return errorResponse('Error al obtener note', 500)
  }
}

// PUT /api/notes/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.note.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Note no encontrado', 404)
    }

    const item = await prisma.note.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating note:', error)
    return errorResponse(error.message || 'Error al actualizar note', 500)
  }
}

// DELETE /api/notes/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.note.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Note no encontrado', 404)
    }

    await prisma.note.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Note eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting note:', error)
    return errorResponse(error.message || 'Error al eliminar note', 500)
  }
}
