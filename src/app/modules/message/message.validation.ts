
    import { z } from 'zod'

    export const MessageSchema = z.object({});

    export type Message = z.infer<typeof MessageSchema>
    