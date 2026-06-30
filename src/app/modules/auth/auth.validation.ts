
    import { z } from 'zod'

    export const AuthSchema = z.object({});

    export type Auth = z.infer<typeof AuthSchema>
    