import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/tools/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Tool no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching tool:', error)
    return errorResponse('Error al obtener tool', 500)
  }
}

// PUT /api/tools/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Tool no encontrado', 404)
    }

    // Manejar imagen base64
    if (body.imageUrl && isBase64Image(body.imageUrl)) {
      if (existing.imageUrl) {
        await deleteImage(existing.imageUrl)
      }
      body.imageUrl = await saveBase64Image(body.imageUrl, 'tools')
    }

    const item = await prisma.tool.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating tool:', error)
    return errorResponse(error.message || 'Error al actualizar tool', 500)
  }
}

// DELETE /api/tools/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Tool no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (item.imageUrl) {
      await deleteImage(item.imageUrl)
    }

    await prisma.tool.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Tool eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting tool:', error)
    return errorResponse(error.message || 'Error al eliminar tool', 500)
  }
}
