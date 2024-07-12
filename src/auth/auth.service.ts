import { AuthOnUsersTable, usersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { z } from 'zod';
import { sql } from "drizzle-orm";

const registrationSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  password: z.string(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["admin", "user", "userAdminRoleAuth"]).optional()
});

type RegistrationInfo = z.infer<typeof registrationSchema>;

export const createAuthUserService = async (user: RegistrationInfo): Promise<number | null> => {
  const parsedData = registrationSchema.parse(user);

  const userRecord = await db.insert(usersTable).values({
    full_name: parsedData.full_name,
    email: parsedData.email,
    contact_phone: parsedData.contact_phone,
    address: parsedData.address,
    role: parsedData.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).returning({ user_id: usersTable.user_id });

  const user_id = userRecord[0]?.user_id;
  if (!user_id) return null;

  await db.insert(AuthOnUsersTable).values({
    user_id: user_id,
    password: parsedData.password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  return user_id;
};

export interface UserDetails {
  password: string;
  email: string;
}

export const userLoginService = async (user: UserDetails) => {
  const {email, password } = user;
  return await db.query.usersTable.findFirst({
    columns: {
      user_id:true,
      email:true,
      full_name:true,
      role:true
    },
    where: sql`${usersTable.email} = ${email}`,
    with: {
      user: {
        columns: {
       password:true
        }
      }
    }
  });

};

// export const emailByUserId = async (id: number): Promise<string | null> => {
//     const result = await db.query.usersTable.findFirst({
//       columns: {
//         email: true,
//       },
//       where: (usersTable, { eq }) => eq(usersTable.user_id, id),
//     });
  
//     if (!result) {
//       return null;
//     }
  
//     return result.email;
//   };