import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"


// GET /api/sajor/[id] - Obtener por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.sajoritem.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('SajorItem no encontrado', 404)
    }

    return successResponse(item)
  } catch (error) {
    console.error('Error fetching sajoritem:', error)
    return errorResponse('Error al obtener sajoritem', 500)
  }
}

// PUT /api/sajor/[id] - Actualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const body = await request.json()

    const existing = await prisma.sajoritem.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return errorResponse('SajorItem no encontrado', 404)
    }

    const item = await prisma.sajoritem.update({
      where: { id: params.id },
      data: body
    })

    return successResponse(item)
  } catch (error: any) {
    console.error('Error updating sajoritem:', error)
    return errorResponse(error.message || 'Error al actualizar sajoritem', 500)
  }
}

// DELETE /api/sajor/[id] - Eliminar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const item = await prisma.sajoritem.findUnique({
      where: { id: params.id }
    })

    if (!item) {
      return errorResponse('SajorItem no encontrado', 404)
    }

    await prisma.sajoritem.delete({
      where: { id: params.id }
    })

    return successResponse({ message: 'SajorItem eliminado correctamente' })
  } catch (error: any) {
    console.error('Error deleting sajoritem:', error)
    return errorResponse(error.message || 'Error al eliminar sajoritem', 500)
  }
}
