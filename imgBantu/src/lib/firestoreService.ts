
'use server';
import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

/**
 * Creates a new document for a user in the 'users' collection.
 * @param userId The ID of the user (from Firebase Auth).
 * @param email The email of the user.
 */
export async function createUserDocument(userId: string, email: string | null): Promise<void> {
  const userDocRef = doc(db, USERS_COLLECTION, userId);
  console.log(`[FirestoreService] Attempting to create user document at path: ${userDocRef.path} for email: ${email}, UID: ${userId}`);
  try {
    await setDoc(userDocRef, {
      email: email,
      createdAt: serverTimestamp(),
    });
    console.log(`[FirestoreService] Successfully created user document for UID: ${userId}`);
  } catch (error) {
    console.error(`[FirestoreService] Error creating user document for UID: ${userId}: `, error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

// Prompt history functions (addPromptToHistory, getUserPromptHistory, deletePromptFromHistory)
// have been completely removed as the feature is rolled back.
