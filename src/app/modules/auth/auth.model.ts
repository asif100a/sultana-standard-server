
  import mongoose, {Schema, Document} from 'mongoose';
  import type { AuthType } from './auth.interface';

  export interface AuthDocumentType extends AuthType, Document {}

  const AuthSchema: Schema = new Schema(
    {
    // TODO: Define Auth schema fields
    },
    {
      timestamps: true,
      versionKey: false
      }
    )
        
    export const AuthModel = mongoose.model<AuthDocumentType>('Auth', AuthSchema);
    