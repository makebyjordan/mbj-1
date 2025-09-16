"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  createdAt: z.any().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

const projectsCollection = collection(db, 'projects');

// Helper to convert Firestore doc to Project
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Project => {
    const data = snapshot.data();
    const project: Project = {
        id: snapshot.id,
        title: data.title || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        imageHint: data.imageHint || "",
        url: data.url || "",
        isFeatured: data.isFeatured || false,
        createdAt: data.createdAt?.toDate(),
    };
    return project;
}

// GET all projects, ordered by creation date
export const getProjects = async (): Promise<Project[]> => {
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new project
export const createProject = async (projectData: Partial<Project>) => {
    const dataToSave = {
        ...projectData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(projectsCollection, dataToSave);
    return docRef.id;
};

// UPDATE a project
export const updateProject = async (id: string, projectData: Partial<Project>) => {
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, projectData);
};

// DELETE a project
export const deleteProject = async (id: string) => {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
};
