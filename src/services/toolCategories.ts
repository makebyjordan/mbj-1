
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const ToolCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido."),
  createdAt: z.any().optional(),
});

export type ToolCategory = z.infer<typeof ToolCategorySchema>;

const toolCategoriesCollection = collection(db, 'toolCategories');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): ToolCategory => {
    const data = snapshot.data();
    return ToolCategorySchema.parse({
        id: snapshot.id,
        name: data.name,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getToolCategories = async (): Promise<ToolCategory[]> => {
    const q = query(toolCategoriesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const createToolCategory = async (categoryData: Omit<ToolCategory, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...categoryData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(toolCategoriesCollection, dataToSave);
    return docRef.id;
};

export const updateToolCategory = async (id: string, categoryData: Partial<ToolCategory>): Promise<void> => {
    const categoryDoc = doc(db, 'toolCategories', id);
    await updateDoc(categoryDoc, categoryData);
};

export const deleteToolCategory = async (id: string): Promise<void> => {
    const categoryDoc = doc(db, 'toolCategories', id);
    await deleteDoc(categoryDoc);
};
