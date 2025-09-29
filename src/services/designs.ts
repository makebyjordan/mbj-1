
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const DesignSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  createdAt: z.any().optional(),
});

export type Design = z.infer<typeof DesignSchema>;

const designsCollection = collection(db, 'designs');

// Helper to convert Firestore doc to Design
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Design => {
    const data = snapshot.data();
    return DesignSchema.parse({
        id: snapshot.id,
        title: data.title,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all designs, ordered by creation date
export const getDesigns = async (): Promise<Design[]> => {
    const q = query(designsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new design
export const createDesign = async (designData: Omit<Design, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...designData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(designsCollection, dataToSave);
    return docRef.id;
};

// UPDATE a design
export const updateDesign = async (id: string, designData: Partial<Design>): Promise<void> => {
    const designDoc = doc(db, 'designs', id);
    await updateDoc(designDoc, designData);
};

// DELETE a design
export const deleteDesign = async (id: string): Promise<void> => {
    const designDoc = doc(db, 'designs', id);
    await deleteDoc(designDoc);
};
