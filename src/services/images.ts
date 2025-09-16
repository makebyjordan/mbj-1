
"use client";

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { z } from 'zod';

const ImageSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  storagePath: z.string(),
  createdAt: z.any(),
});

export type ImageData = z.infer<typeof ImageSchema>;

const imagesCollection = collection(db, 'images');

export const uploadImage = async (file: File): Promise<ImageData> => {
  const timestamp = Date.now();
  const storagePath = `gallery/${timestamp}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  // Upload file
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);

  // Add metadata to Firestore
  const docData = {
    name: file.name,
    url: downloadURL,
    storagePath: storagePath,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(imagesCollection, docData);

  return ImageSchema.parse({
    id: docRef.id,
    ...docData,
    createdAt: new Date(), // Approximate for client-side return
  });
};

export const getImages = async (): Promise<ImageData[]> => {
  const q = query(imagesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ImageSchema.parse({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  }));
};

export const deleteImage = async (image: ImageData): Promise<void> => {
  // Delete from Firestore
  const imageDoc = doc(db, 'images', image.id);
  await deleteDoc(imageDoc);

  // Delete from Storage
  try {
    const storageRef = ref(storage, image.storagePath);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting image from storage:", error);
      // Optional: Handle this error, e.g., by logging it or notifying the user.
      // We don't re-throw, as the Firestore entry is already deleted.
    }
  }
};
