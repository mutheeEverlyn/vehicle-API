import 'dotenv/config';
import { Context } from 'hono';
import { createAuthUserService, userLoginService } from './auth.service';
import bcrypt from 'bcrypt';
import { sign } from 'hono/jwt';
import assert from 'assert';

assert(process.env.JWT_SECRET);

export const registerUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    console.log(user);

    const pass = user.password;
    const hashedPassword = await bcrypt.hash(pass, 10);
    user.password = hashedPassword;

    const userId = await createAuthUserService(user);
    console.log(userId);

    if (!userId) return c.text("User not created", 404);


    return c.json({ msg: 'User created successfully' }, 201);
  } catch (error: any) {
    console.error("Error during registration:", error);
    return c.json({ error: error?.message }, 400);
  }
};

export interface userDetails {
  full_name: string;
  contact_phone: string;
  address: string;
  user_id: number;
  role: string;
  email: string;
}

export interface UserAuthDetails {
  password: string;
  user: userDetails;
}

export const loginUser = async (c: Context) => {
  try {
    const {email,password} = await c.req.json();
    const userExist = await userLoginService({email,password});

    if (!userExist) return c.json({ error: 'User not found' }, 404);

    const userMatch = await bcrypt.compare(password, userExist?.user.password as string);
    if (!userMatch) {
      return c.json({ error: 'Invalid details' }, 401);
    } else {
      const payload = {
        sub: userExist?.email,
        role: userExist?.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 1800),  // 30 hours session expiration
      };
      const secret = process.env.JWT_SECRET as string;
      const token = await sign(payload, secret);
      const responseInfo = {
        token,
        user: {
          user_id:userExist?.user_id,
          role: userExist?.role,
          full_name: userExist?.full_name,
          email: userExist?.email,
        }
      };

      return c.json(responseInfo, 200);
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    return c.json({ error: error?.message }, 400);
  }
};
