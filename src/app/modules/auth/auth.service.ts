
    import { type AuthType } from './auth.interface';
    import { AuthModel } from './auth.model';

    export class AuthService {
        async findAll(): Promise<AuthType[]> {
            return AuthModel.find();
        }

        async findById(id: string): Promise<AuthType | null> {
            return AuthModel.findById(id);
        }

        async create(data: Partial<AuthType>): Promise<AuthType> {
            return AuthModel.create(data);
        }

        async update(id: string, data: Partial<AuthType>): Promise<AuthType | null> {
            return AuthModel.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await AuthModel.findByIdAndDelete(id)
        }
    }
    