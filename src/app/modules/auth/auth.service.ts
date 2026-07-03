import { verifyFirebaseToken } from "../../config/firebase";
import { handleToken, type TokenPayloadType } from "../../utils/token.utils";
import { UserService } from "../user/user.service";
import type { SyncRequestBody } from "./auth.interface";
import { getAuth } from "firebase-admin/auth";

const userService = new UserService();

export class AuthService {
  /**
   * Sync a Firebase-authenticated user with the backend database.
   * 1. Verifies the Firebase ID token
   * 2. Finds or creates the user in MongoDB
   * 3. Generates backend JWT tokens
   */
  async syncUser(
    firebaseIdToken: string,
    userData: SyncRequestBody
  ) {
    // Verify Firebase ID token
    const decodedToken = await verifyFirebaseToken(firebaseIdToken);

    // Find or create user in database
    const user = await userService.findOrCreateByFirebase(
      decodedToken.uid,
      {
        name: userData.name,
        email: userData.email || decodedToken.email || "",
        phone: userData.phone || decodedToken.phone_number || "",
        profilePicture: userData.profilePicture || decodedToken.picture || "",
      }
    );

    // Generate backend JWT tokens
    const tokenPayload: TokenPayloadType = {
      userId: (user as any)._id.toString(),
      firebaseUid: decodedToken.uid,
      email: user.email,
      role: user.role,
    };

    const accessToken = handleToken.generateAccessToken(tokenPayload);
    const refreshToken = handleToken.generateRefreshToken(tokenPayload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Check if a backend JWT is valid and return the associated user.
   */
  async checkAuth(tokenPayload: TokenPayloadType) {
    const user = await userService.findByFirebaseUid(tokenPayload.firebaseUid);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Delete user from both Firebase and database.
   */
  async deleteAccount(firebaseUid: string) {
    // Delete from Firebase
    try {
      await getAuth().deleteUser(firebaseUid);
    } catch (error) {
      console.error("Firebase user deletion failed (may already be deleted):", error);
    }

    // Delete from database
    await userService.deleteByFirebaseUid(firebaseUid);
  }
}