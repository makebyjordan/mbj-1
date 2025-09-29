
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const PromptSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  promptText: z.string().min(1, "El texto del prompt es requerido."),
  createdAt: z.any().optional(),
});

export type Prompt = z.infer<typeof PromptSchema>;

const promptsCollection = collection(db, 'prompts');

// Helper to convert Firestore doc to Prompt
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Prompt => {
    const data = snapshot.data();
    return PromptSchema.parse({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        promptText: data.promptText,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all prompts, ordered by creation date
export const getPrompts = async (): Promise<Prompt[]> => {
    const q = query(promptsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new prompt
export const createPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...promptData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(promptsCollection, dataToSave);
    return docRef.id;
};

// UPDATE a prompt
export const updatePrompt = async (id: string, promptData: Partial<Prompt>): Promise<void> => {
    const promptDoc = doc(db, 'prompts', id);
    await updateDoc(promptDoc, promptData);
};

// DELETE a prompt
export const deletePrompt = async (id: string): Promise<void> => {
    const promptDoc = doc(db, 'prompts', id);
    await deleteDoc(promptDoc);
};
