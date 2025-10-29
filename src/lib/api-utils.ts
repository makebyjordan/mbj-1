import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getAuthSession()

  if (!session || !session.user) {
    throw new Error("No autenticado")
  }

  return session
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

// Función helper para manejar uploads de imágenes base64
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image')
}

export function base64ToBuffer(base64: string): { buffer: Buffer; mimeType: string } {
  const matches = base64.match(/^data:(.+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Invalid base64 string')
  }

  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  return { buffer, mimeType }
}
