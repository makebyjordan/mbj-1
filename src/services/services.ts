
"use client";

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';

const ServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  iconUrl: z.string().url(),
  url: z.string().url().optional().or(z.literal('')),
  createdAt: z.any().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

const servicesCollection = collection(db, 'services');

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Service => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        title: data.title,
        description: data.description,
        iconUrl: data.iconUrl,
        url: data.url || "",
        createdAt: data.createdAt?.toDate(),
    };
}

export const getServices = async (): Promise<Service[]> => {
    const q = query(servicesCollection, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

const uploadIcon = async (id: string, iconDataUrl: string): Promise<string> => {
    const storageRef = ref(storage, `services/${id}.svg`);
    await uploadString(storageRef, iconDataUrl, 'data_url');
    return getDownloadURL(storageRef);
};

export const createService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    const dataToSave = {
        title: serviceData.title,
        description: serviceData.description,
        url: serviceData.url || "",
        createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(servicesCollection, dataToSave);
    
    let iconUrl = "";
    if (serviceData.iconUrl && serviceData.iconUrl.startsWith('data:image/svg+xml')) {
        iconUrl = await uploadIcon(docRef.id, serviceData.iconUrl);
    }
    
    await updateDoc(docRef, { iconUrl });

    return docRef.id;
};

export const updateService = async (id: string, serviceData: Partial<Service>) => {
    const serviceDoc = doc(db, 'services', id);
    const dataToUpdate = { ...serviceData };

    if (serviceData.iconUrl && serviceData.iconUrl.startsWith('data:image/svg+xml')) {
        dataToUpdate.iconUrl = await uploadIcon(id, serviceData.iconUrl);
    }
    
    await updateDoc(serviceDoc, dataToUpdate);
};

export const deleteService = async (id: string) => {
    const serviceDoc = doc(db, 'services', id);
    await deleteDoc(serviceDoc);

    try {
        const storageRef = ref(storage, `services/${id}.svg`);
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting icon from storage:", error);
        }
    }
};

    