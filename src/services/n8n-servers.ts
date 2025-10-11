"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const N8NServerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  url: z.string().url("Debe ser una URL válida."),
  code: z.string().min(4, "El código es requerido."),
  createdAt: z.any().optional(),
});

export type N8NServer = z.infer<typeof N8NServerSchema>;

const n8nServersCollection = collection(db, 'n8nServers');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): N8NServer => {
    const data = snapshot.data();
    return N8NServerSchema.parse({
        id: snapshot.id,
        title: data.title,
        url: data.url,
        code: data.code,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getN8NServers = async (): Promise<N8NServer[]> => {
    const q = query(n8nServersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getN8NServerById = async (id: string): Promise<N8NServer | null> => {
    const serverDoc = doc(db, 'n8nServers', id);
    const docSnap = await getDoc(serverDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return N8NServerSchema.parse({
            id: docSnap.id,
            ...data
        })
    } else {
        return null;
    }
}

export const createN8NServer = async (serverData: Omit<N8NServer, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...serverData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(n8nServersCollection, dataToSave);
    return docRef.id;
};

export const updateN8NServer = async (id: string, serverData: Partial<N8NServer>): Promise<void> => {
    const serverDoc = doc(db, 'n8nServers', id);
    await updateDoc(serverDoc, serverData);
};

export const deleteN8NServer = async (id: string): Promise<void> => {
    const serverDoc = doc(db, 'n8nServers', id);
    await deleteDoc(serverDoc);
};
