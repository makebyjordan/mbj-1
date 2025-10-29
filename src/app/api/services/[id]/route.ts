import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/services/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Service no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching service:', error)
    return errorResponse('Error al obtener service', 500)
  }
}

// PUT /api/services/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Service no encontrado', 404)
    }

    // Manejar imagen base64
    if (body.iconUrl && isBase64Image(body.iconUrl)) {
      if (existing.iconUrl) {
        await deleteImage(existing.iconUrl)
      }
      body.iconUrl = await saveBase64Image(body.iconUrl, 'services')
    }

    const item = await prisma.service.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating service:', error)
    return errorResponse(error.message || 'Error al actualizar service', 500)
  }
}

// DELETE /api/services/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Service no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (item.iconUrl) {
      await deleteImage(item.iconUrl)
    }

    await prisma.service.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Service eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return errorResponse(error.message || 'Error al eliminar service', 500)
  }
}
