
    import {Router} from 'express';
    import { UserController } from './user.controller';

    const userRoute = Router();
    const userController = new UserController();

    userRoute.get('/', userController.getAll.bind(userController));
    userRoute.get('/:id', userController.getById.bind(userController));
    userRoute.post('/', userController.create.bind(userController));
    userRoute.put('/:id', userController.update.bind(userController));
    userRoute.delete('/:id', userController.delete.bind(userController));

    export default userRoute;
    