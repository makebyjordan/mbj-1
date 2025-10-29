import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/n8n-servers/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.n8nserver.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('N8NServer no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching n8nserver:', error)
    return errorResponse('Error al obtener n8nserver', 500)
  }
}

// PUT /api/n8n-servers/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.n8nserver.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('N8NServer no encontrado', 404)
    }

    const item = await prisma.n8nserver.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating n8nserver:', error)
    return errorResponse(error.message || 'Error al actualizar n8nserver', 500)
  }
}

// DELETE /api/n8n-servers/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.n8nserver.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('N8NServer no encontrado', 404)
    }

    await prisma.n8nserver.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'N8NServer eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting n8nserver:', error)
    return errorResponse(error.message || 'Error al eliminar n8nserver', 500)
  }
}
