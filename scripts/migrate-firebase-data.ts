/**
 * Script para migrar datos de Firebase a PostgreSQL
 * Ejecutar con: npm run migrate:firebase
 *
 * IMPORTANTE: Este script debe ejecutarse DESPUÉS de:
 * 1. Configurar PostgreSQL
 * 2. Ejecutar: npx prisma migrate dev --name init
 * 3. Ejecutar: npm run db:seed (para crear usuarios)
 */

import { PrismaClient } from '@prisma/client'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import * as fs from 'fs/promises'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

// Configuración de Firebase (usa las variables de entorno)
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app, 'mbj-ddbb')

// Función helper para convertir Timestamp de Firestore a Date
function convertTimestamp(data: any) {
  if (data?.toDate) {
    return data.toDate()
  }
  if (data?.seconds) {
    return new Date(data.seconds * 1000)
  }
  return data
}

// Función para descargar imágenes de Firebase Storage (opcional)
async function downloadImage(url: string, folder: string, filename: string): Promise<string | null> {
  try {
    if (!url || !url.startsWith('http')) return url

    // Si quieres descargar las imágenes localmente, descomenta esto
    // const response = await fetch(url)
    // const buffer = await response.arrayBuffer()
    // const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    // await fs.mkdir(uploadDir, { recursive: true })
    // await fs.writeFile(path.join(uploadDir, filename), Buffer.from(buffer))
    // return `/uploads/${folder}/${filename}`

    // Por ahora, mantener las URLs de Firebase Storage
    return url
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error)
    return url
  }
}

async function migrateCollection(
  collectionName: string,
  transformFn: (doc: any) => any,
  prismaModel: any
) {
  console.log(`\n📦 Migrando ${collectionName}...`)

  try {
    const snapshot = await getDocs(collection(db, collectionName))
    const docs = snapshot.docs

    console.log(`   Encontrados ${docs.length} documentos`)

    for (const doc of docs) {
      try {
        const data = doc.data()
        const transformedData = await transformFn({ id: doc.id, ...data })

        await prismaModel.upsert({
          where: { id: transformedData.id },
          update: transformedData,
          create: transformedData,
        })

        console.log(`   ✅ Migrado: ${transformedData.id}`)
      } catch (error: any) {
        console.error(`   ❌ Error migrando documento ${doc.id}:`, error.message)
      }
    }

    console.log(`✨ ${collectionName} completado!`)
  } catch (error: any) {
    console.error(`❌ Error en colección ${collectionName}:`, error.message)
  }
}

async function main() {
  console.log('🔄 Iniciando migración de Firebase a PostgreSQL...\n')

  // Projects
  await migrateCollection(
    'projects',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      imageUrl: doc.imageUrl || null,
      url: doc.url || null,
      type: doc.type || 'project',
      htmlContent: doc.htmlContent || null,
      categoryId: doc.categoryId || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.project
  )

  // Blog Categories
  await migrateCollection(
    'blogCategories',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      imageUrl: doc.imageUrl || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.blogCategory
  )

  // Services
  await migrateCollection(
    'services',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      iconUrl: doc.iconUrl || null,
      url: doc.url || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.service
  )

  // Notes
  await migrateCollection(
    'notes',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.note
  )

  // Git Protocols
  await migrateCollection(
    'gitProtocols',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || null,
      steps: doc.steps || [],
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.gitProtocol
  )

  // Protocols
  await migrateCollection(
    'protocols',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      steps: doc.steps || [],
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.protocol
  )

  // Aprende Pages
  await migrateCollection(
    'aprendePages',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      code: doc.code,
      hero: doc.hero || null,
      features: doc.features || null,
      steps: doc.steps || null,
      pricing: doc.pricing || null,
      faq: doc.faq || null,
      contacts: doc.contacts || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
      updatedAt: convertTimestamp(doc.updatedAt) || new Date(),
    }),
    prisma.aprendePage
  )

  // Images
  await migrateCollection(
    'images',
    async (doc) => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      storagePath: doc.storagePath || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.image
  )

  // Prompts
  await migrateCollection(
    'prompts',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || null,
      promptText: doc.promptText,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.prompt
  )

  // N8N Templates
  await migrateCollection(
    'n8nTemplates',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      jsonContent: doc.jsonContent || null,
      htmlContent: doc.htmlContent || null,
      url: doc.url || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.n8NTemplate
  )

  // N8N Servers
  await migrateCollection(
    'n8nServers',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url || null,
      code: doc.code || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.n8NServer
  )

  // Designs
  await migrateCollection(
    'designs',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      imageUrl: doc.imageUrl || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.design
  )

  // HTML Pages
  await migrateCollection(
    'htmls',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      htmlContent: doc.htmlContent,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.htmlPage
  )

  // Link Cards
  await migrateCollection(
    'linkCards',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      imageUrl: doc.imageUrl || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.linkCard
  )

  // Links
  await migrateCollection(
    'links',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url,
      tag: doc.tag || null,
      cardId: doc.cardId || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.linkItem
  )

  // Formations
  await migrateCollection(
    'formations',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || null,
      url: doc.url || null,
      tag: doc.tag || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.formation
  )

  // Shorts
  await migrateCollection(
    'shorts',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      youtubeUrl: doc.youtubeUrl,
      tags: doc.tags || [],
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.short
  )

  // Tool Categories
  await migrateCollection(
    'toolCategories',
    async (doc) => ({
      id: doc.id,
      name: doc.name,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.toolCategory
  )

  // Tools
  await migrateCollection(
    'tools',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || null,
      imageUrl: doc.imageUrl || null,
      url: doc.url || null,
      price: doc.price || null,
      paymentDay: doc.paymentDay || null,
      isPaid: doc.isPaid || false,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.tool
  )

  // Sajor Items
  await migrateCollection(
    'sajorItems',
    async (doc) => ({
      id: doc.id,
      title: doc.title,
      url: doc.url || null,
      description: doc.description || null,
      notes: doc.notes || null,
      createdAt: convertTimestamp(doc.createdAt) || new Date(),
    }),
    prisma.sajorItem
  )

  // Hero Content (singleton)
  console.log('\n📦 Migrando heroContent...')
  try {
    const snapshot = await getDocs(collection(db, 'heroContent'))
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      const data = doc.data()

      await prisma.heroContent.upsert({
        where: { id: 'herocontent_singleton' },
        update: {
          description: data.description || null,
          backgroundImageUrl: data.backgroundImageUrl || null,
          buttons: data.buttons || [],
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
        },
        create: {
          id: 'herocontent_singleton',
          description: data.description || null,
          backgroundImageUrl: data.backgroundImageUrl || null,
          buttons: data.buttons || [],
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
        },
      })

      console.log('   ✅ HeroContent migrado')
    }
    console.log('✨ heroContent completado!')
  } catch (error: any) {
    console.error('❌ Error en heroContent:', error.message)
  }

  // About Content (singleton)
  console.log('\n📦 Migrando aboutContent...')
  try {
    const snapshot = await getDocs(collection(db, 'aboutContent'))
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      const data = doc.data()

      await prisma.aboutContent.upsert({
        where: { id: 'aboutcontent_singleton' },
        update: {
          title: data.title || null,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
        },
        create: {
          id: 'aboutcontent_singleton',
          title: data.title || null,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
        },
      })

      console.log('   ✅ AboutContent migrado')
    }
    console.log('✨ aboutContent completado!')
  } catch (error: any) {
    console.error('❌ Error en aboutContent:', error.message)
  }

  console.log('\n✨ ¡Migración completada exitosamente!')
  console.log('\nPróximos pasos:')
  console.log('1. Verifica los datos con: npx prisma studio')
  console.log('2. Actualiza los servicios del cliente para usar las APIs')
  console.log('3. Actualiza el Dashboard')
  console.log('4. Prueba la aplicación')
  console.log('5. Cuando todo funcione, elimina las dependencias de Firebase')
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en migración:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
