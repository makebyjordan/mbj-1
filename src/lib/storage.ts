import fs from 'fs/promises'
import path from 'path'
import { base64ToBuffer } from './api-utils'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Asegurarse de que el directorio de uploads existe
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function saveBase64Image(
  base64: string,
  folder: string,
  filename?: string
): Promise<string> {
  await ensureUploadDir()

  const { buffer, mimeType } = base64ToBuffer(base64)
  const extension = mimeType.split('/')[1]
  const finalFilename = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`

  const folderPath = path.join(UPLOAD_DIR, folder)
  await fs.mkdir(folderPath, { recursive: true })

  const filePath = path.join(folderPath, finalFilename)
  await fs.writeFile(filePath, buffer)

  // Retornar la URL pública
  return `/uploads/${folder}/${finalFilename}`
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Extraer la ruta del archivo de la URL
    if (!url.startsWith('/uploads/')) return

    const filePath = path.join(process.cwd(), 'public', url)
    await fs.unlink(filePath)
  } catch (error) {
    // Ignorar errores si el archivo no existe
    console.error('Error deleting image:', error)
  }
}

export async function saveFile(
  buffer: Buffer,
  folder: string,
  filename: string
): Promise<string> {
  await ensureUploadDir()

  const folderPath = path.join(UPLOAD_DIR, folder)
  await fs.mkdir(folderPath, { recursive: true })

  const filePath = path.join(folderPath, filename)
  await fs.writeFile(filePath, buffer)

  return `/uploads/${folder}/${filename}`
}
