import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/n8n-templates/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.n8ntemplate.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('N8NTemplate no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching n8ntemplate:', error)
    return errorResponse('Error al obtener n8ntemplate', 500)
  }
}

// PUT /api/n8n-templates/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.n8ntemplate.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('N8NTemplate no encontrado', 404)
    }

    const item = await prisma.n8ntemplate.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating n8ntemplate:', error)
    return errorResponse(error.message || 'Error al actualizar n8ntemplate', 500)
  }
}

// DELETE /api/n8n-templates/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.n8ntemplate.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('N8NTemplate no encontrado', 404)
    }

    await prisma.n8ntemplate.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'N8NTemplate eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting n8ntemplate:', error)
    return errorResponse(error.message || 'Error al eliminar n8ntemplate', 500)
  }
}
