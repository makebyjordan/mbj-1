
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const LinkCardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  imageUrl: z.string().url("La URL de la imagen es requerida."),
  createdAt: z.any().optional(),
});

export type LinkCard = z.infer<typeof LinkCardSchema>;

const linkCardsCollection = collection(db, 'linkCards');

// Helper to convert Firestore doc to LinkCard
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): LinkCard => {
    const data = snapshot.data();
    return LinkCardSchema.parse({
        id: snapshot.id,
        title: data.title,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all link cards, ordered by creation date
export const getLinkCards = async (): Promise<LinkCard[]> => {
    const q = query(linkCardsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new link card
export const createLinkCard = async (cardData: Omit<LinkCard, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...cardData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(linkCardsCollection, dataToSave);
    return docRef.id;
};

// UPDATE a link card
export const updateLinkCard = async (id: string, cardData: Partial<LinkCard>): Promise<void> => {
    const cardDoc = doc(db, 'linkCards', id);
    await updateDoc(cardDoc, cardData);
};

// DELETE a link card
export const deleteLinkCard = async (id: string): Promise<void> => {
    const cardDoc = doc(db, 'linkCards', id);
    await deleteDoc(cardDoc);
};

    