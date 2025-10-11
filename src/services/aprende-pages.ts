"use client";

import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

export interface FeatureCard {
  icon?: string;
  title?: string;
  description?: string;
}

export interface StepItem {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface IconListItem {
  icon?: string;
  title?: string;
}

export interface MediaGridCard {
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface PricingCard {
  htmlContent: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface OpenQuestionItem {
  question: string;
}

export interface CheckboxOption {
  label: string;
}

export interface CheckboxQuestionItem {
  question: string;
  options: CheckboxOption[];
}

export interface AprendePageData {
  id: string;
  title: string;
  code: string;
  createdAt: any;
  updatedAt: any;
  htmlText?: string;
  heroEnabled?: boolean;
  heroTitle?: string;
  heroDescription?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  heroImageUrl?: string;
  featureSectionEnabled?: boolean;
  featureSectionTitle?: string;
  featureSectionDescription?: string;
  featureSectionCtaText?: string;
  featureSectionCtaUrl?: string;
  featureSectionCards?: FeatureCard[];
  stepsSectionEnabled?: boolean;
  stepsSectionItems?: StepItem[];
  iconListSectionEnabled?: boolean;
  iconListSectionDescription?: string;
  iconListSectionItems?: IconListItem[];
  mediaGridSectionEnabled?: boolean;
  mediaGridSectionCards?: MediaGridCard[];
  pricingSectionEnabled?: boolean;
  pricingSectionCards?: PricingCard[];
  fullWidthMediaSectionEnabled?: boolean;
  fullWidthMediaSectionTitle?: string;
  fullWidthMediaSectionDescription?: string;
  fullWidthMediaSectionImageUrl?: string;
  fullWidthMediaSectionVideoUrl?: string;
  faqSectionEnabled?: boolean;
  faqSectionItems?: FaqItem[];
  openQuestionnaireEnabled?: boolean;
  openQuestionnaireTitle?: string;
  openQuestionnaireItems?: OpenQuestionItem[];
  checkboxQuestionnaireEnabled?: boolean;
  checkboxQuestionnaireTitle?: string;
  checkboxQuestionnaireItems?: CheckboxQuestionItem[];
  contactFormEnabled?: boolean;
  contactFormTitle?: string;
  contactFormShowName?: boolean;
  contactFormShowPhone?: boolean;
  contactFormShowEmail?: boolean;
  contactFormShowTextMessage?: boolean;
  contactFormShowInstagram?: boolean;
  contactFormShowFacebook?: boolean;
  contactFormShowLinkedIn?: boolean;
  contactFormShowTikTok?: boolean;
  ctaSectionEnabled?: boolean;
  ctaSectionTitle?: string;
  ctaSectionDescription?: string;
  ctaSectionButtonText?: string;
  ctaSectionButtonUrl?: string;
}

export type AprendePageInput = Omit<AprendePageData, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const aprendePagesCollectionRef = collection(db, 'aprendePages');

export async function getAprendePages(): Promise<AprendePageData[]> {
    const q = query(aprendePagesCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AprendePageData));
}

export async function getAprendePageById(id: string): Promise<AprendePageData | null> {
    const docRef = doc(db, 'aprendePages', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AprendePageData;
    }
    return null;
}

export async function saveAprendePage(data: AprendePageInput): Promise<ActionResult<string>> {
  try {
    let docId: string;
    const { id, ...saveData } = data;

    if (id) {
      docId = id;
      const docRef = doc(db, 'aprendePages', docId);
      await updateDoc(docRef, {
        ...saveData,
        updatedAt: serverTimestamp(),
      });
    } else {
      const docRef = await addDoc(aprendePagesCollectionRef, {
        ...saveData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      docId = docRef.id;
    }
    
    // In a client component context, we can't use revalidatePath
    // The real-time listener in the dashboard will handle UI updates.

    return { success: true, data: docId };

  } catch (error: any) {
    console.error('Error saving page:', error);
    return { success: false, error: 'La página no se pudo guardar. ' + error.message };
  }
}

export async function deleteAprendePage(id: string): Promise<ActionResult<null>> {
  try {
    await deleteDoc(doc(db, 'aprendePages', id));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return { success: false, error: 'No se pudo eliminar la página. ' + error.message };
  }
}

export async function duplicateAprendePage(id: string): Promise<ActionResult<string>> {
  try {
    const docRef = doc(db, 'aprendePages', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'La página original no existe.' };
    }

    const originalData = docSnap.data();
    const { id: _, createdAt, updatedAt, ...copyData } = originalData;

    const newDocRef = await addDoc(aprendePagesCollectionRef, {
      ...copyData,
      title: `Copia de ${originalData.title}`,
      code: `${originalData.code}-copia-${Date.now()}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, data: newDocRef.id };

  } catch (error: any) {
    console.error('Error duplicating page:', error);
    return { success: false, error: 'No se pudo duplicar la página. ' + error.message };
  }
}
