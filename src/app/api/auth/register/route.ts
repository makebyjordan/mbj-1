import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/api-utils"
import bcrypt from "bcryptjs"

// POST /api/auth/register - Registrar nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password) {
      return errorResponse('Email y contraseña son requeridos')
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse('El usuario ya existe')
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return successResponse(user, 201)
  } catch (error: any) {
    console.error('Error registering user:', error)
    return errorResponse(error.message || 'Error al registrar usuario', 500)
  }
}
