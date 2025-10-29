import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/tool-categories/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.toolcategory.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('ToolCategory no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching toolcategory:', error)
    return errorResponse('Error al obtener toolcategory', 500)
  }
}

// PUT /api/tool-categories/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.toolcategory.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('ToolCategory no encontrado', 404)
    }

    const item = await prisma.toolcategory.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating toolcategory:', error)
    return errorResponse(error.message || 'Error al actualizar toolcategory', 500)
  }
}

// DELETE /api/tool-categories/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.toolcategory.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('ToolCategory no encontrado', 404)
    }

    await prisma.toolcategory.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'ToolCategory eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting toolcategory:', error)
    return errorResponse(error.message || 'Error al eliminar toolcategory', 500)
  }
}
