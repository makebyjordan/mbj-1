import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse, isBase64Image, requireAuth } from "@/lib/api-utils"
import { saveBase64Image, deleteImage } from "@/lib/storage"

// GET /api/about-content - Obtener contenido singleton
export async function GET() {
  try {
    const content = await prisma.aboutcontent.findUnique({
      where: { id: 'aboutcontent_singleton' }
    })

    return successResponse(content || {})
  } catch (error) {
    console.error('Error fetching aboutcontent:', error)
    return errorResponse('Error al obtener aboutcontent', 500)
  }
}

// PUT /api/about-content - Actualizar contenido singleton
export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()

    // Manejar imagen base64
    let finalImageUrl = body.imageUrl
    if (body.imageUrl && isBase64Image(body.imageUrl)) {
      const existing = await prisma.aboutcontent.findUnique({
        where: { id: 'aboutcontent_singleton' }
      })

      if (existing?.imageUrl) {
        await deleteImage(existing.imageUrl)
      }

      finalImageUrl = await saveBase64Image(body.imageUrl, 'about')
      body.imageUrl = finalImageUrl
    }

    const content = await prisma.aboutcontent.upsert({
      where: { id: 'aboutcontent_singleton' },
      update: body,
      create: { id: 'aboutcontent_singleton', ...body }
    })

    return successResponse(content)
  } catch (error: any) {
    console.error('Error updating aboutcontent:', error)
    return errorResponse(error.message || 'Error al actualizar aboutcontent', 500)
  }
}
