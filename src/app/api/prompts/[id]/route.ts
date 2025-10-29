import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/prompts/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.prompt.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Prompt no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return errorResponse('Error al obtener prompt', 500)
  }
}

// PUT /api/prompts/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.prompt.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('Prompt no encontrado', 404)
    }

    const item = await prisma.prompt.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating prompt:', error)
    return errorResponse(error.message || 'Error al actualizar prompt', 500)
  }
}

// DELETE /api/prompts/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.prompt.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('Prompt no encontrado', 404)
    }

    await prisma.prompt.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'Prompt eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting prompt:', error)
    return errorResponse(error.message || 'Error al eliminar prompt', 500)
  }
}
