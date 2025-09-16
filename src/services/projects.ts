"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { z } from 'zod';

// Zod schema for validation
const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "El título es requerido"),
  description: z.string().min(10, "La descripción es requerida"),
  imageUrl: z.string().url("La URL de la imagen no es válida"),
  imageHint: z.string().optional(),
  url: z.string().url("La URL del proyecto no es válida").optional().or(z.literal('')),
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
    };
}

// GET all projects
export const getProjects = async (): Promise<Project[]> => {
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new project
export const createProject = async (projectData: Omit<Project, 'id'>) => {
    ProjectSchema.omit({ id: true }).parse(projectData);
    const docRef = await addDoc(projectsCollection, projectData);
    return docRef.id;
};

// UPDATE a project
export const updateProject = async (id: string, projectData: Partial<Omit<Project, 'id'>>) => {
    ProjectSchema.omit({ id: true }).partial().parse(projectData);
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, projectData);
};

// DELETE a project
export const deleteProject = async (id: string) => {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
};
