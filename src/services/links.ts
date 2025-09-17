
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const LinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  url: z.string().url("Debe ser una URL válida."),
  tag: z.string().min(1, "La etiqueta es requerida."),
  createdAt: z.any().optional(),
});

export type LinkItem = z.infer<typeof LinkSchema>;

const linksCollection = collection(db, 'links');

// Helper to convert Firestore doc to LinkItem
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): LinkItem => {
    const data = snapshot.data();
    return LinkSchema.parse({
        id: snapshot.id,
        title: data.title,
        url: data.url,
        tag: data.tag,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all links, ordered by creation date
export const getLinks = async (): Promise<LinkItem[]> => {
    const q = query(linksCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new link
export const createLink = async (linkData: Omit<LinkItem, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...linkData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(linksCollection, dataToSave);
    return docRef.id;
};

// UPDATE a link
export const updateLink = async (id: string, linkData: Partial<LinkItem>): Promise<void> => {
    const linkDoc = doc(db, 'links', id);
    await updateDoc(linkDoc, linkData);
};

// DELETE a link
export const deleteLink = async (id: string): Promise<void> => {
    const linkDoc = doc(db, 'links', id);
    await deleteDoc(linkDoc);
};
