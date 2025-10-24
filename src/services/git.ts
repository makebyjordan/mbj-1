
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const GitStepSchema = z.object({
  gitCommand: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

const GitProtocolSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  steps: z.array(GitStepSchema).optional(),
  createdAt: z.any().optional(),
});

export type GitProtocol = z.infer<typeof GitProtocolSchema>;
export type GitStep = z.infer<typeof GitStepSchema>;

const gitProtocolsCollection = collection(db, 'gitProtocols');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): GitProtocol => {
    const data = snapshot.data();
    return GitProtocolSchema.parse({
        id: snapshot.id,
        title: data.title,
        description: data.description || '',
        steps: data.steps || [],
        createdAt: data.createdAt?.toDate(),
    });
}

export const getGitProtocols = async (): Promise<GitProtocol[]> => {
    const q = query(gitProtocolsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getGitProtocolById = async (id: string): Promise<GitProtocol | null> => {
    const protocolDoc = doc(db, 'gitProtocols', id);
    const docSnap = await getDoc(protocolDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return GitProtocolSchema.parse({
            id: docSnap.id,
            ...data
        })
    } else {
        return null;
    }
}

export const createGitProtocol = async (protocolData: Omit<GitProtocol, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...protocolData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(gitProtocolsCollection, dataToSave);
    return docRef.id;
};

export const updateGitProtocol = async (id: string, protocolData: Partial<GitProtocol>): Promise<void> => {
    const protocolDoc = doc(db, 'gitProtocols', id);
    await updateDoc(protocolDoc, protocolData);
};

export const deleteGitProtocol = async (id: string): Promise<void> => {
    const protocolDoc = doc(db, 'gitProtocols', id);
    await deleteDoc(protocolDoc);
};

    