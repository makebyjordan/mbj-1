import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/projects/[id] - Obtener proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        category: true
      }
    })

    if (!project) {
      return errorResponse('Proyecto no encontrado', 404)
    }

    return successResponse(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return errorResponse('Error al obtener proyecto', 500)
  }
}

// PUT /api/projects/[id] - Actualizar proyecto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()
    const { title, description, imageUrl, url, type, htmlContent, categoryId } = body

    // Verificar que el proyecto existe
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return errorResponse('Proyecto no encontrado', 404)
    }

    // Manejar imagen base64
    let finalImageUrl = imageUrl
    if (imageUrl && isBase64Image(imageUrl)) {
      // Eliminar imagen anterior si existe
      if (existingProject.imageUrl) {
        await deleteImage(existingProject.imageUrl)
      }
      finalImageUrl = await saveBase64Image(imageUrl, 'projects')
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
        ...(url !== undefined && { url }),
        ...(type && { type }),
        ...(htmlContent !== undefined && { htmlContent }),
        ...(categoryId !== undefined && { categoryId })
      },
      include: {
        category: true
      }
    })

    return successResponse(project)
  } catch (error: any) {
    console.error('Error updating project:', error)
    return errorResponse(error.message || 'Error al actualizar proyecto', 500)
  }
}

// DELETE /api/projects/[id] - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return errorResponse('Proyecto no encontrado', 404)
    }

    // Eliminar imagen si existe
    if (project.imageUrl) {
      await deleteImage(project.imageUrl)
    }

    await prisma.project.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Proyecto eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return errorResponse(error.message || 'Error al eliminar proyecto', 500)
  }
}
