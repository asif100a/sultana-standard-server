import { type UserType } from "./user.interface";
import { UserModel } from "./user.model";
import { uploadToCloudinary } from "../../utils/cloudinary";

export class UserService {
  private async processProfilePicture(profilePicture?: string): Promise<string | undefined> {
    if (!profilePicture) return undefined;
    if (profilePicture.startsWith("data:image") || profilePicture.includes(";base64,")) {
      try {
        return await uploadToCloudinary(profilePicture);
      } catch (err) {
        console.error("Cloudinary upload failed, using original string:", err);
      }
    }
    return profilePicture;
  }

  async findAll(): Promise<UserType[]> {
    return UserModel.find();
  }

  async findVerifiedChatPartners(currentUserId: string): Promise<UserType[]> {
    return UserModel.find({
      _id: { $ne: currentUserId },
      isVerified: true,
    });
  }

  async findById(id: string): Promise<UserType | null> {
    return UserModel.findById(id);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserType | null> {
    return UserModel.findOne({ firebaseUid });
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return UserModel.findOne({ email });
  }

  /**
   * Find an existing user by Firebase UID, or create a new one.
   * Used during the auth sync flow after Firebase sign-in.
   */
  async findOrCreateByFirebase(
    firebaseUid: string,
    userData: {
      name: string;
      email: string;
      phone: string;
      profilePicture?: string;
    }
  ): Promise<UserType> {
    const existingUser = await UserModel.findOne({ firebaseUid });
    const profilePicture = await this.processProfilePicture(userData.profilePicture);

    if (existingUser) {
      // Update user data if it has changed
      existingUser.name = userData.name || existingUser.name;
      existingUser.email = userData.email || existingUser.email;
      existingUser.phone = userData.phone || existingUser.phone;
      if (profilePicture) {
        existingUser.profilePicture = profilePicture;
      }
      await existingUser.save();
      return existingUser;
    }

    // Create new user
    const newUser = await UserModel.create({
      firebaseUid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      profilePicture: profilePicture || "",
      role: "USER",
      isVerified: true, // Verified through Firebase
      isPhoneVerified: false,
    });

    return newUser;
  }

  async create(data: Partial<UserType>): Promise<UserType> {
    if (data.profilePicture) {
      data.profilePicture = await this.processProfilePicture(data.profilePicture);
    }
    return UserModel.create(data);
  }

  async update(
    id: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    if (data.profilePicture) {
      data.profilePicture = await this.processProfilePicture(data.profilePicture);
    }
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateByFirebaseUid(
    firebaseUid: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    if (data.profilePicture) {
      data.profilePicture = await this.processProfilePicture(data.profilePicture);
    }
    return UserModel.findOneAndUpdate({ firebaseUid }, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async deleteByFirebaseUid(firebaseUid: string): Promise<void> {
    await UserModel.findOneAndDelete({ firebaseUid });
  }
}
