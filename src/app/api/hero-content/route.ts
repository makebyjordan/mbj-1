import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/hero-content - Obtener contenido singleton
export async function GET() {
  try {
    const content = await prisma.herocontent.findUnique({
      where: { id: 'herocontent_singleton' }
    })

    return successResponse(content || {})
  } catch (error) {
    console.error('Error fetching herocontent:', error)
    return errorResponse('Error al obtener herocontent', 500)
  }
}

// PUT /api/hero-content - Actualizar contenido singleton
export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Manejar imagen base64
    let finalImageUrl = body.backgroundImageUrl
    if (body.backgroundImageUrl && isBase64Image(body.backgroundImageUrl)) {
      const existing = await prisma.herocontent.findUnique({
        where: { id: 'herocontent_singleton' }
      })

      if (existing?.backgroundImageUrl) {
        await deleteImage(existing.backgroundImageUrl)
      }

      finalImageUrl = await saveBase64Image(body.backgroundImageUrl, 'hero')
      body.backgroundImageUrl = finalImageUrl
    }

    const content = await prisma.herocontent.upsert({
      where: { id: 'herocontent_singleton' },
      update: body,
      create: { id: 'herocontent_singleton', ...body }
    })

    return successResponse(content)
  } catch (error: any) {
    console.error('Error updating herocontent:', error)
    return errorResponse(error.message || 'Error al actualizar herocontent', 500)
  }
}
