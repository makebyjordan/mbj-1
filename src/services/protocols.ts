
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';
import type { StepItem } from './aprende-pages';

const ProtocolStepSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

const ProtocolSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  steps: z.array(ProtocolStepSchema).optional(),
  createdAt: z.any().optional(),
});

export type Protocol = z.infer<typeof ProtocolSchema>;

const protocolsCollection = collection(db, 'protocols');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Protocol => {
    const data = snapshot.data();
    return ProtocolSchema.parse({
        id: snapshot.id,
        title: data.title,
        steps: data.steps || [],
        createdAt: data.createdAt?.toDate(),
    });
}

export const getProtocols = async (): Promise<Protocol[]> => {
    const q = query(protocolsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getProtocolById = async (id: string): Promise<Protocol | null> => {
    const protocolDoc = doc(db, 'protocols', id);
    const docSnap = await getDoc(protocolDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return ProtocolSchema.parse({
            id: docSnap.id,
            ...data
        })
    } else {
        return null;
    }
}

export const createProtocol = async (protocolData: Omit<Protocol, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...protocolData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(protocolsCollection, dataToSave);
    return docRef.id;
};

export const updateProtocol = async (id: string, protocolData: Partial<Protocol>): Promise<void> => {
    const protocolDoc = doc(db, 'protocols', id);
    await updateDoc(protocolDoc, protocolData);
};

export const deleteProtocol = async (id: string): Promise<void> => {
    const protocolDoc = doc(db, 'protocols', id);
    await deleteDoc(protocolDoc);
};
