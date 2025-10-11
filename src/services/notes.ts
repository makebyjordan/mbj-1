
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const NoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  createdAt: z.any().optional(),
});

export type Note = z.infer<typeof NoteSchema>;

const notesCollection = collection(db, 'notes');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Note => {
    const data = snapshot.data();
    return NoteSchema.parse({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getNotes = async (): Promise<Note[]> => {
    const q = query(notesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...noteData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(notesCollection, dataToSave);
    return docRef.id;
};

export const updateNote = async (id: string, noteData: Partial<Note>): Promise<void> => {
    const noteDoc = doc(db, 'notes', id);
    await updateDoc(noteDoc, noteData);
};

export const deleteNote = async (id: string): Promise<void> => {
    const noteDoc = doc(db, 'notes', id);
    await deleteDoc(noteDoc);
};

