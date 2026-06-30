
  import mongoose, {Schema, Document} from 'mongoose';
  import type { UserType } from './user.interface';

  export interface UserDocumentType extends UserType, Document {}

  const UserSchema: Schema = new Schema(
    {
    // TODO: Define User schema fields
    },
    {
      timestamps: true,
      versionKey: false
      }
    )
        
    export const UserModel = mongoose.model<UserDocumentType>('User', UserSchema);
    