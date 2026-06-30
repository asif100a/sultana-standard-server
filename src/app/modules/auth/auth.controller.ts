
    import type {Request, Response} from 'express'
    import {AuthService} from './auth.service';
    import { catchAsync } from '../../utils/index'
    import type { AuthResponseType } from './auth.interface'
    
    const authService = new AuthService();
    
    export class AuthController {
        async getAll(req: Request, res: Response): Promise<void> {
            try{
                const data = await authService.findAll();
                res.status(200).json({
                success: true,
                message: "The auth data retrieved successfully",
                data
            })
            } catch(error: any) {
                catchAsync(res, error)
            }
        }

        async getById(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try{
                const data = await authService.findById(paramsId as string);
                if(!data) {
                    res.status(404).json({
                        success: false,
                        message: "Auth not found"
                        })
                    return;
                }
                res.status(200).json({
                success: true,
                message: "The auth data retrieved successfully",
                data
            })
            } catch(error: any) {
               catchAsync(res, error)
            }
        }

        async create(req: Request, res: Response): Promise<void> {
            try{
                const data = await authService.create(req.body);
                res.status(201).json({
                    success: true,
                    message: "The auth data created successfully",
                    data
                })
            }catch(error: any) {
                catchAsync(res, error)
            }
        }

        async update(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try {
                const data = await authService.update(paramsId as string, req.body);
                res.status(200).json({
                    success: true,
                    message: "The auth data updated successfully",
                    data
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }

        async delete(req: Request, res: Response): Promise<void> {
            try {
                const paramsId = req.params.id
                if (!paramsId) {
                  throw new Error("Id not found!");
                }
                await authService.delete(paramsId as string)
                res.status(200).json({
                    success: true,
                    message: "The auth data deleted successfully",
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }
    
    }