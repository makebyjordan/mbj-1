import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/link-cards/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.linkcard.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('LinkCard no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching linkcard:', error)
    return errorResponse('Error al obtener linkcard', 500)
  }
}

// PUT /api/link-cards/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.linkcard.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('LinkCard no encontrado', 404)
    }

    // Manejar imagen base64
    if (body.imageUrl && isBase64Image(body.imageUrl)) {
      if (existing.imageUrl) {
        await deleteImage(existing.imageUrl)
      }
      body.imageUrl = await saveBase64Image(body.imageUrl, 'link-cards')
    }

    const item = await prisma.linkcard.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating linkcard:', error)
    return errorResponse(error.message || 'Error al actualizar linkcard', 500)
  }
}

// DELETE /api/link-cards/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.linkcard.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('LinkCard no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (item.imageUrl) {
      await deleteImage(item.imageUrl)
    }

    await prisma.linkcard.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'LinkCard eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting linkcard:', error)
    return errorResponse(error.message || 'Error al eliminar linkcard', 500)
  }
}
