
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';
import { addImageByUrl } from './images';

const ResultadoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  prompt: z.string().min(1, "El prompt es requerido."),
  imageUrl: z.string().url("La URL de la imagen es requerida."),
  imageUrl2: z.string().url().optional().or(z.literal('')),
  imageUrl3: z.string().url().optional().or(z.literal('')),
  createdAt: z.any().optional(),
});

export type Resultado = z.infer<typeof ResultadoSchema>;
export type ResultadoInput = Omit<Resultado, 'id' | 'createdAt'> & { id?: string };


const resultadosCollection = collection(db, 'resultados');

// Helper to convert Firestore doc to Resultado
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Resultado => {
    const data = snapshot.data();
    return ResultadoSchema.parse({
        id: snapshot.id,
        title: data.title,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        imageUrl2: data.imageUrl2 || '',
        imageUrl3: data.imageUrl3 || '',
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all resultados, ordered by creation date
export const getResultados = async (): Promise<Resultado[]> => {
    const q = query(resultadosCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// SAVE (create or update) a resultado
export const saveResultado = async (data: ResultadoInput): Promise<string> => {
    // Also add the images to the general gallery
    if(data.imageUrl) await addImageByUrl(data.imageUrl);
    if(data.imageUrl2) await addImageByUrl(data.imageUrl2);
    if(data.imageUrl3) await addImageByUrl(data.imageUrl3);

    if (data.id) {
        const { id, ...updateData } = data;
        const docRef = doc(db, 'resultados', id);
        await updateDoc(docRef, updateData);
        return id;
    } else {
        const docRef = await addDoc(resultadosCollection, {
            ...data,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }
};

// DELETE a resultado
export const deleteResultado = async (id: string): Promise<void> => {
    const resultadoDoc = doc(db, 'resultados', id);
    await deleteDoc(resultadoDoc);
};
