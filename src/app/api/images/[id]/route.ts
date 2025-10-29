import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/images/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.image.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Image no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching image:', error)
    return errorResponse('Error al obtener image', 500)
  }
}

// PUT /api/images/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.image.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Image no encontrado', 404)
    }

    // Manejar imagen base64
    if (body.url && isBase64Image(body.url)) {
      if (existing.url) {
        await deleteImage(existing.url)
      }
      body.url = await saveBase64Image(body.url, 'gallery')
    }

    const item = await prisma.image.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating image:', error)
    return errorResponse(error.message || 'Error al actualizar image', 500)
  }
}

// DELETE /api/images/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.image.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Image no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (item.url) {
      await deleteImage(item.url)
    }

    await prisma.image.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Image eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting image:', error)
    return errorResponse(error.message || 'Error al eliminar image', 500)
  }
}
