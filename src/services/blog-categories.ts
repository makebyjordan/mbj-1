
"use client";

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { z } from 'zod';

const BlogCategorySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es requerido."),
  imageUrl: z.string().url("La URL de la imagen es requerida."),
  createdAt: z.any().optional(),
});

export type BlogCategory = z.infer<typeof BlogCategorySchema>;

const blogCategoriesCollection = collection(db, 'blogCategories');

// Helper to convert Firestore doc to BlogCategory
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): BlogCategory => {
    const data = snapshot.data();
    return BlogCategorySchema.parse({
        id: snapshot.id,
        title: data.title,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate(),
    });
}

// GET all blog categories, ordered by creation date
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
    const q = query(blogCategoriesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
};

// CREATE a new blog category
export const createBlogCategory = async (categoryData: Omit<BlogCategory, 'id' | 'createdAt'>): Promise<string> => {
    const dataToSave = {
        ...categoryData,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(blogCategoriesCollection, dataToSave);
    return docRef.id;
};

// UPDATE a blog category
export const updateBlogCategory = async (id: string, categoryData: Partial<BlogCategory>): Promise<void> => {
    const categoryDoc = doc(db, 'blogCategories', id);
    await updateDoc(categoryDoc, categoryData);
};

// DELETE a blog category
export const deleteBlogCategory = async (id: string): Promise<void> => {
    const categoryDoc = doc(db, 'blogCategories', id);
    await deleteDoc(categoryDoc);
};
