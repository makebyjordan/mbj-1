
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const HtmlSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  htmlContent: z.string().min(1, "El contenido HTML es requerido."),
  createdAt: z.any().optional(),
});

export type HtmlPage = z.infer<typeof HtmlSchema>;

const htmlsCollection = collection(db, 'htmls');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): HtmlPage => {
    const data = snapshot.data();
    return HtmlSchema.parse({
        id: snapshot.id,
        title: data.title,
        htmlContent: data.htmlContent,
        createdAt: data.createdAt?.toDate(),
    });
}

export const getHtmls = async (): Promise<HtmlPage[]> => {
    const q = query(htmlsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

export const getHtmlById = async (id: string): Promise<HtmlPage | null> => {
    const htmlDoc = doc(db, 'htmls', id);
    const docSnap = await getDoc(htmlDoc);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return HtmlSchema.parse({
            id: docSnap.id,
            title: data.title,
            htmlContent: data.htmlContent,
            createdAt: data.createdAt?.toDate(),
        })
    } else {
        return null;
    }
}

export const createHtml = async (htmlData: Omit<HtmlPage, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...htmlData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(htmlsCollection, dataToSave);
    return docRef.id;
};

export const updateHtml = async (id: string, htmlData: Partial<HtmlPage>): Promise<void> => {
    const htmlDoc = doc(db, 'htmls', id);
    await updateDoc(htmlDoc, htmlData);
};

export const deleteHtml = async (id: string): Promise<void> => {
    const htmlDoc = doc(db, 'htmls', id);
    await deleteDoc(htmlDoc);
};
