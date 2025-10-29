/**
 * Script de inicialización de base de datos
 * Ejecutar con: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuarios por defecto
  const users = [
    {
      email: 'jordan@mbj.com',
      password: 'jordan10', // Mismo código que usabas antes
      name: 'Jordan - Core',
      role: 'admin'
    },
    {
      email: 'sajor@mbj.com',
      password: 'S1ndr2J1rd2n', // Mismo código de Sajor
      name: 'Sajor User',
      role: 'sajor'
    }
  ]

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      })

      console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`)
    } else {
      console.log(`⏭️  Usuario ya existe: ${userData.email}`)
    }
  }

  // Inicializar documentos singleton
  const heroContent = await prisma.heroContent.findUnique({
    where: { id: 'herocontent_singleton' }
  })

  if (!heroContent) {
    await prisma.heroContent.create({
      data: {
        id: 'herocontent_singleton',
        description: 'Bienvenido a MBJ',
        buttons: []
      }
    })
    console.log('✅ HeroContent inicializado')
  }

  const aboutContent = await prisma.aboutContent.findUnique({
    where: { id: 'aboutcontent_singleton' }
  })

  if (!aboutContent) {
    await prisma.aboutContent.create({
      data: {
        id: 'aboutcontent_singleton',
        title: 'Sobre Nosotros',
        description: 'Contenido sobre nosotros'
      }
    })
    console.log('✅ AboutContent inicializado')
  }

  console.log('✨ Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
