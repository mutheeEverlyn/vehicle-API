import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { registerUser,loginUser} from './auth.controller'
// import { registerUserSchema, loginUserSchema } from '../validators'

export const authRouter = new Hono();


authRouter.post('/register', registerUser)

authRouter.post('/login', loginUser)