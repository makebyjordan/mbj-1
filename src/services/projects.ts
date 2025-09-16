"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

// Zod schema for validation
const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "El título es requerido"),
  description: z.string().min(10, "La descripción es requerida"),
  imageUrl: z.string().url("La URL de la imagen no es válida"),
  imageHint: z.string().optional(),
  url: z.string().url("La URL del proyecto no es válida").optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  createdAt: z.any().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

const projectsCollection = collection(db, 'projects');

// Helper to convert Firestore doc to Project
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Project => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        imageHint: data.imageHint,
        url: data.url,
        isFeatured: data.isFeatured,
        createdAt: data.createdAt?.toDate(),
    };
}

// GET all projects, ordered by creation date
export const getProjects = async (): Promise<Project[]> => {
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new project
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const dataWithTimestamp = {
        ...projectData,
        createdAt: serverTimestamp()
    };
    ProjectSchema.omit({ id: true, createdAt: true }).parse(projectData);
    const docRef = await addDoc(projectsCollection, dataWithTimestamp);
    return docRef.id;
};

// UPDATE a project
export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    ProjectSchema.omit({ id: true, createdAt: true }).partial().parse(projectData);
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, projectData);
};

// DELETE a project
export const deleteProject = async (id: string) => {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
};
