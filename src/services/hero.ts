
"use client";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const HeroButtonSchema = z.object({
  text: z.string(),
  url: z.string(),
  variant: z.enum(["primary", "outline"]),
});

const HeroContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  backgroundImageUrl: z.string().url(),
  buttons: z.array(HeroButtonSchema).max(2),
  updatedAt: z.any().optional(),
});

export type HeroContentData = z.infer<typeof HeroContentSchema>;

const heroContentRef = doc(db, 'heroContent', 'main');

// GET the hero content
export const getHeroContent = async (): Promise<HeroContentData> => {
    const docSnap = await getDoc(heroContentRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        // Add default empty values if fields are missing
        const validatedData = {
            title: data.title || 'MAKEBYJORDAN',
            description: data.description || 'Una mente creativa forjando experiencias digitales. Construyo sitios web impresionantes, marcas poderosas y contenido atractivo que cuenta una historia.',
            backgroundImageUrl: data.backgroundImageUrl || 'https://picsum.photos/seed/hero/1920/1080',
            buttons: data.buttons || [
                { text: 'Ver Mi Trabajo', url: '#portfolio', variant: 'primary'},
                { text: 'Ponte en Contacto', url: '#contact', variant: 'outline'}
            ],
        };
        return HeroContentSchema.parse(validatedData);
    } else {
        // Return default content if the document doesn't exist
        const defaultContent: HeroContentData = {
            title: 'MAKEBYJORDAN',
            description: 'Una mente creativa forjando experiencias digitales. Construyo sitios web impresionantes, marcas poderosas y contenido atractivo que cuenta una historia.',
            backgroundImageUrl: 'https://picsum.photos/seed/hero/1920/1080',
            buttons: [
                { text: 'Ver Mi Trabajo', url: '#portfolio', variant: 'primary'},
                { text: 'Ponte en Contacto', url: '#contact', variant: 'outline'}
            ]
        };
        return defaultContent;
    }
};

// UPDATE the hero content
export const updateHeroContent = async (heroData: HeroContentData): Promise<void> => {
    const dataToSave = {
        ...heroData,
        updatedAt: serverTimestamp()
    };
    await setDoc(heroContentRef, dataToSave, { merge: true });
};
