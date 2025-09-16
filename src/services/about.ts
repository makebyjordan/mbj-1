
"use client";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const AboutContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  updatedAt: z.any().optional(),
});

export type AboutContentData = z.infer<typeof AboutContentSchema>;

const aboutContentRef = doc(db, 'aboutContent', 'main');

// GET the about content
export const getAboutContent = async (): Promise<AboutContentData> => {
    const docSnap = await getDoc(aboutContentRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const validatedData = {
            title: data.title || 'Sobre Mí',
            description: data.description || '¡Hola! Soy Jordan, un apasionado creador y arquitecto digital. Mi misión es construir cosas que no solo sean hermosas y funcionales, sino que también cuenten una historia convincente.\n\nCon experiencia en desarrollo web, branding y estrategia de contenido, abordo cada proyecto con una perspectiva holística. Ya sea un nuevo sitio web, una identidad de marca o una idea de negocio, me encanta el proceso de convertir una chispa de inspiración en una realidad tangible. Creemos algo increíble juntos.',
            imageUrl: data.imageUrl || 'https://picsum.photos/seed/about-me/600/600',
        };
        return AboutContentSchema.parse(validatedData);
    } else {
        // Return default content if the document doesn't exist
        const defaultContent: AboutContentData = {
            title: 'Sobre Mí',
            description: '¡Hola! Soy Jordan, un apasionado creador y arquitecto digital. Mi misión es construir cosas que no solo sean hermosas y funcionales, sino que también cuenten una historia convincente.\n\nCon experiencia en desarrollo web, branding y estrategia de contenido, abordo cada proyecto con una perspectiva holística. Ya sea un nuevo sitio web, una identidad de marca o una idea de negocio, me encanta el proceso de convertir una chispa de inspiración en una realidad tangible. Creemos algo increíble juntos.',
            imageUrl: 'https://picsum.photos/seed/about-me/600/600',
        };
        return defaultContent;
    }
};

// UPDATE the about content
export const updateAboutContent = async (aboutData: AboutContentData): Promise<void> => {
    const dataToSave = {
        ...aboutData,
        updatedAt: serverTimestamp()
    };
    await setDoc(aboutContentRef, dataToSave, { merge: true });
};
