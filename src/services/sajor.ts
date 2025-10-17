
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const SajorSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.any().optional(),
});

export type SajorItem = z.infer<typeof SajorSchema>;

const sajorCollection = collection(db, 'sajorItems');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): SajorItem => {
    const data = snapshot.data();
    return SajorSchema.parse({
        id: snapshot.id,
        title: data.title,
        url: data.url,
        description: data.description,
        notes: data.notes,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getSajorItems = async (): Promise<SajorItem[]> => {
    const q = query(sajorCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const createSajorItem = async (itemData: Omit<SajorItem, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...itemData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(sajorCollection, dataToSave);
    return docRef.id;
};

export const updateSajorItem = async (id: string, itemData: Partial<SajorItem>): Promise<void> => {
    const itemDoc = doc(db, 'sajorItems', id);
    await updateDoc(itemDoc, itemData);
};

export const deleteSajorItem = async (id: string): Promise<void> => {
    const itemDoc = doc(db, 'sajorItems', id);
    await deleteDoc(itemDoc);
};

    