/**
 * Firebase Admin SDK Initialization
 * WHY: Server-side Firebase operations (verify tokens, Firestore writes) require the Admin SDK.
 * Uses service account credentials from environment variables.
 * Gracefully handles missing config — server still works with dummy data.
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let adminDb = null;
let adminAuth = null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (projectId && clientEmail && privateKey) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log('✓ Firebase Admin SDK initialized successfully');
  } catch (err) {
    console.warn('⚠ Firebase Admin SDK initialization failed:', err.message);
    console.warn('  Server will use dummy data fallback.');
  }
} else {
  console.warn('⚠ Firebase credentials not configured. Server will use dummy data.');
  console.warn('  Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env');
}

export { adminDb, adminAuth };
export default admin;
