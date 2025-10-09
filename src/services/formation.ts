
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const FormationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  tag: z.string().optional(),
  createdAt: z.any().optional(),
});

export type Formation = z.infer<typeof FormationSchema>;

const formationCollection = collection(db, 'formations');

// Helper to convert Firestore doc to Formation
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Formation => {
    const data = snapshot.data();
    return FormationSchema.parse({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        url: data.url,
        tag: data.tag,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all formations, ordered by creation date
export const getFormations = async (): Promise<Formation[]> => {
    const q = query(formationCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new formation item
export const createFormation = async (formationData: Omit<Formation, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...formationData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(formationCollection, dataToSave);
    return docRef.id;
};

// UPDATE a formation item
export const updateFormation = async (id: string, formationData: Partial<Formation>): Promise<void> => {
    const formationDoc = doc(db, 'formations', id);
    await updateDoc(formationDoc, formationData);
};

// DELETE a formation item
export const deleteFormation = async (id: string): Promise<void> => {
    const formationDoc = doc(db, 'formations', id);
    await deleteDoc(formationDoc);
};
