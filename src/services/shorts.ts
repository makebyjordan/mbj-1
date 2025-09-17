
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const ShortSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  youtubeUrl: z.string().url("Debe ser una URL de YouTube válida."),
  createdAt: z.any().optional(),
});

export type Short = z.infer<typeof ShortSchema>;

const shortsCollection = collection(db, 'shorts');

// Helper to convert Firestore doc to Short
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Short => {
    const data = snapshot.data();
    return ShortSchema.parse({
        id: snapshot.id,
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all shorts, ordered by creation date
export const getShorts = async (): Promise<Short[]> => {
    const q = query(shortsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new short
export const createShort = async (shortData: Omit<Short, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...shortData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(shortsCollection, dataToSave);
    return docRef.id;
};

// UPDATE a short
export const updateShort = async (id: string, shortData: Partial<Short>): Promise<void> => {
    const shortDoc = doc(db, 'shorts', id);
    await updateDoc(shortDoc, shortData);
};

// DELETE a short
export const deleteShort = async (id: string): Promise<void> => {
    const shortDoc = doc(db, 'shorts', id);
    await deleteDoc(shortDoc);
};
