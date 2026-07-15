import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { envConfig } from "./env";

const getFirebaseAdminConfig = () => {
  if (envConfig.FIREBASE_CLIENT_EMAIL && envConfig.FIREBASE_PRIVATE_KEY) {
    return {
      credential: cert({
        projectId: envConfig.FIREBASE_PROJECT_ID,
        clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
        privateKey: envConfig.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      projectId: envConfig.FIREBASE_PROJECT_ID,
    };
  }

  return {
    projectId: envConfig.FIREBASE_PROJECT_ID,
  };
};

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp(getFirebaseAdminConfig());
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
