import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { envConfig } from "./env";

// Initialize Firebase Admin SDK
// Uses project ID for token verification without a service account file
if (!getApps().length) {
  initializeApp({
    projectId: envConfig.FIREBASE_PROJECT_ID,
  });
}

/**
 * Verify a Firebase ID token and return the decoded token.
 * The mobile app sends this token after Firebase Auth sign-in.
 */
export const verifyFirebaseToken = async (
  idToken: string
): Promise<DecodedIdToken> => {
  return getAuth().verifyIdToken(idToken);
};
