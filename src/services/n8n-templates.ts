
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const N8NTemplateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  jsonContent: z.string().min(1, "El contenido JSON es requerido."),
  htmlContent: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  createdAt: z.any().optional(),
});

export type N8NTemplate = z.infer<typeof N8NTemplateSchema>;

const n8nTemplatesCollection = collection(db, 'n8nTemplates');

// Helper to convert Firestore doc to N8NTemplate
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): N8NTemplate => {
    const data = snapshot.data();
    return N8NTemplateSchema.parse({
        id: snapshot.id,
        title: data.title,
        jsonContent: data.jsonContent,
        htmlContent: data.htmlContent || "",
        url: data.url || "",
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all templates, ordered by creation date
export const getN8NTemplates = async (): Promise<N8NTemplate[]> => {
    const q = query(n8nTemplatesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// GET a single template by ID
export const getN8NTemplateById = async (id: string): Promise<N8NTemplate | null> => {
    const templateDoc = doc(db, 'n8nTemplates', id);
    const docSnap = await getDoc(templateDoc);

    if (docSnap.exists()) {
        return fromFirestore(docSnap as QueryDocumentSnapshot<DocumentData>);
    } else {
        return null;
    }
}

// CREATE a new template
export const createN8NTemplate = async (templateData: Omit<N8NTemplate, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...templateData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(n8nTemplatesCollection, dataToSave);
    return docRef.id;
};

// UPDATE a template
export const updateN8NTemplate = async (id: string, templateData: Partial<N8NTemplate>): Promise<void> => {
    const templateDoc = doc(db, 'n8nTemplates', id);
    await updateDoc(templateDoc, templateData);
};

// DELETE a template
export const deleteN8NTemplate = async (id: string): Promise<void> => {
    const templateDoc = doc(db, 'n8nTemplates', id);
    await deleteDoc(templateDoc);
};
