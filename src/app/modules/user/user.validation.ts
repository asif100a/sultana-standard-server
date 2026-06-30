
    import { z } from 'zod'

    export const UserSchema = z.object({});

    export type User = z.infer<typeof UserSchema>
    