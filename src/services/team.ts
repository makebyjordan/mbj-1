
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const TeamItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido."),
  position: z.string().min(1, "La posición es requerida."),
  bio: z.string().optional(),
  imageUrl: z.string().url("URL de imagen inválida.").optional().or(z.literal('')),
  email: z.string().email("Email inválido.").optional().or(z.literal('')),
  linkedinUrl: z.string().url("URL de LinkedIn inválida.").optional().or(z.literal('')),
  portfolioUrl: z.string().url("URL de portafolio inválida.").optional().or(z.literal('')),
  createdAt: z.any().optional(),
});

export type TeamItem = z.infer<typeof TeamItemSchema>;

const teamCollection = collection(db, 'teamItems');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): TeamItem => {
    const data = snapshot.data();
    return TeamItemSchema.parse({
        id: snapshot.id,
        name: data.name,
        position: data.position,
        bio: data.bio || '',
        imageUrl: data.imageUrl || '',
        email: data.email || '',
        linkedinUrl: data.linkedinUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        createdAt: data.createdAt?.toDate(),
    });
}

export const getTeamItems = async (): Promise<TeamItem[]> => {
    const q = query(teamCollection, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const createTeamItem = async (itemData: Omit<TeamItem, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...itemData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(teamCollection, dataToSave);
    return docRef.id;
};

export const updateTeamItem = async (id: string, itemData: Partial<TeamItem>): Promise<void> => {
    const itemDoc = doc(db, 'teamItems', id);
    await updateDoc(itemDoc, itemData);
};

export const deleteTeamItem = async (id: string): Promise<void> => {
    const itemDoc = doc(db, 'teamItems', id);
    await deleteDoc(itemDoc);
};
