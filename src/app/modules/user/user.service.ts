import { type UserType } from "./user.interface";
import { UserModel } from "./user.model";

export class UserService {
  async findAll(): Promise<UserType[]> {
    return UserModel.find();
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
    }
  ): Promise<UserType> {
    const existingUser = await UserModel.findOne({ firebaseUid });

    if (existingUser) {
      // Update user data if it has changed
      existingUser.name = userData.name || existingUser.name;
      existingUser.email = userData.email || existingUser.email;
      existingUser.phone = userData.phone || existingUser.phone;
      await existingUser.save();
      return existingUser;
    }

    // Create new user
    const newUser = await UserModel.create({
      firebaseUid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: "USER",
      isVerified: true, // Verified through Firebase
      isPhoneVerified: false,
    });

    return newUser;
  }

  async create(data: Partial<UserType>): Promise<UserType> {
    return UserModel.create(data);
  }

  async update(
    id: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async updateByFirebaseUid(
    firebaseUid: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    return UserModel.findOneAndUpdate({ firebaseUid }, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async deleteByFirebaseUid(firebaseUid: string): Promise<void> {
    await UserModel.findOneAndDelete({ firebaseUid });
  }
}