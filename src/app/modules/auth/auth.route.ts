
    import {Router} from 'express';
    import { AuthController } from './auth.controller';

    const authRoute = Router();
    const authController = new AuthController();

    authRoute.get('/', authController.getAll.bind(authController));
    authRoute.get('/:id', authController.getById.bind(authController));
    authRoute.post('/', authController.create.bind(authController));
    authRoute.put('/:id', authController.update.bind(authController));
    authRoute.delete('/:id', authController.delete.bind(authController));

    export default authRoute;
    