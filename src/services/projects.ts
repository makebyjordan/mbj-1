"use client";

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';

const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  type: z.enum(['project', 'blog']).default('project'),
  htmlContent: z.string().optional(),
  categoryId: z.string().optional(),
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
        type: data.type || 'project',
        htmlContent: data.htmlContent || "",
        categoryId: data.categoryId || "",
        createdAt: data.createdAt?.toDate(),
    };
    // Ensure the schema is valid on data read
    return ProjectSchema.parse(project);
}

// GET all projects, ordered by creation date
export const getProjects = async (): Promise<Project[]> => {
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// GET a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
    const projectDoc = doc(db, 'projects', id);
    const docSnap = await getDoc(projectDoc);

    if (docSnap.exists()) {
        return fromFirestore(docSnap as QueryDocumentSnapshot<DocumentData>);
    } else {
        return null;
    }
}

// CREATE a new project
export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const dataToSave: Omit<Project, 'id' | 'imageUrl' | 'createdAt'> & { createdAt: any; imageUrl?: string } = {
        ...projectData,
        createdAt: serverTimestamp()
    };

    if (projectData.imageUrl && projectData.imageUrl.startsWith('data:image')) {
        const docRef = await addDoc(projectsCollection, { title: projectData.title, description: projectData.description }); // Create doc first to get ID
        const storageRef = ref(storage, `projects/${docRef.id}`);
        const uploadResult = await uploadString(storageRef, projectData.imageUrl, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);
        await updateDoc(docRef, { 
            ...dataToSave,
            imageUrl: downloadURL
        });
        return docRef.id;
    } else {
        const docRef = await addDoc(projectsCollection, { ...dataToSave, imageUrl: projectData.imageUrl || '' });
        return docRef.id;
    }
};

// UPDATE a project
export const updateProject = async (id: string, projectData: Partial<Project>) => {
    const projectDoc = doc(db, 'projects', id);
    const dataToUpdate = { ...projectData };

    if (projectData.imageUrl && projectData.imageUrl.startsWith('data:image')) {
        const storageRef = ref(storage, `projects/${id}`);
        const uploadResult = await uploadString(storageRef, projectData.imageUrl, 'data_url');
        dataToUpdate.imageUrl = await getDownloadURL(uploadResult.ref);
    }
    
    await updateDoc(projectDoc, dataToUpdate);
};

// DELETE a project
export const deleteProject = async (id: string) => {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);

    // Also delete the image from storage
    try {
        const storageRef = ref(storage, `projects/${id}`);
        await deleteObject(storageRef);
    } catch (error: any) {
        // It's okay if the image doesn't exist.
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting image from storage:", error);
        }
    }
};