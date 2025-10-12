
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const ToolSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  price: z.number().optional(),
  paymentDay: z.number().optional(),
  isPaid: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
  createdAt: z.any().optional(),
});

export type Tool = z.infer<typeof ToolSchema>;

const toolsCollection = collection(db, 'tools');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Tool => {
    const data = snapshot.data();
    return ToolSchema.parse({
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getTools = async (): Promise<Tool[]> => {
    const q = query(toolsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const createTool = async (toolData: Omit<Tool, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...toolData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(toolsCollection, dataToSave);
    return docRef.id;
};

export const updateTool = async (id: string, toolData: Partial<Tool>): Promise<void> => {
    const toolDoc = doc(db, 'tools', id);
    await updateDoc(toolDoc, toolData);
};

export const deleteTool = async (id: string): Promise<void> => {
    const toolDoc = doc(db, 'tools', id);
    await deleteDoc(toolDoc);
};
