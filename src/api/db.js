import { db } from '../firebase';
import { doc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';

/**
 * Saves or updates a user search record in Firestore.
 * @param {string} username - The username searched
 */
export async function saveUserSearch(username) {
    if (!username || !db) return;

    const normalizedUsername = username.toLowerCase();
    const userRef = doc(db, 'users', normalizedUsername);

    try {
        // Use setDoc with merge: true to create if doesn't exist, or update if it does
        await setDoc(userRef, {
            username: normalizedUsername,
            originalUsername: username, // Keep the casing they typed
            lastSearchedAt: serverTimestamp(),
            searchCount: increment(1)
        }, { merge: true });
    } catch (error) {
        console.error('Error saving user search:', error);
        // Don't throw, we don't want to break the app flow for analytics
    }
}

/**
 * Updates a user record with their email address.
 * @param {string} username - The username to link the email to
 * @param {string} email - The email address
 */
export async function updateUserEmail(username, email) {
    if (!username || !email || !db) return;

    const normalizedUsername = username.toLowerCase();
    const userRef = doc(db, 'users', normalizedUsername);

    try {
        await setDoc(userRef, {
            email: email,
            lastEmailSubmittedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user email:', error);
        throw error; // Throw here so the UI can show an error if needed
    }
}
