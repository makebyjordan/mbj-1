import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/blog-categories/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.blogcategory.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('BlogCategory no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching blogcategory:', error)
    return errorResponse('Error al obtener blogcategory', 500)
  }
}

// PUT /api/blog-categories/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.blogcategory.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('BlogCategory no encontrado', 404)
    }

    // Manejar imagen base64
    if (body.imageUrl && isBase64Image(body.imageUrl)) {
      if (existing.imageUrl) {
        await deleteImage(existing.imageUrl)
      }
      body.imageUrl = await saveBase64Image(body.imageUrl, 'blog-categories')
    }

    const item = await prisma.blogcategory.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating blogcategory:', error)
    return errorResponse(error.message || 'Error al actualizar blogcategory', 500)
  }
}

// DELETE /api/blog-categories/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.blogcategory.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('BlogCategory no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (item.imageUrl) {
      await deleteImage(item.imageUrl)
    }

    await prisma.blogcategory.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'BlogCategory eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting blogcategory:', error)
    return errorResponse(error.message || 'Error al eliminar blogcategory', 500)
  }
}
