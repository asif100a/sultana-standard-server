
    import { type UserType } from './user.interface';
    import { UserModel } from './user.model';

    export class UserService {
        async findAll(): Promise<UserType[]> {
            return UserModel.find();
        }

        async findById(id: string): Promise<UserType | null> {
            return UserModel.findById(id);
        }

        async create(data: Partial<UserType>): Promise<UserType> {
            return UserModel.create(data);
        }

        async update(id: string, data: Partial<UserType>): Promise<UserType | null> {
            return UserModel.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await UserModel.findByIdAndDelete(id)
        }
    }
    