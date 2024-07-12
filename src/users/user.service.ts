import { eq} from "drizzle-orm";
import db from "../drizzle/db";
import {usersTable, tiUsers,tsUsers} from "../drizzle/schema"


export const usersService = async (limit?: number):Promise<tsUsers[] | null> => {
    if (limit) {
        return await db.query.usersTable.findMany({
            limit: limit
        });
    }
    return await db.query.usersTable.findMany();
}

export const getUserService = async (id: number) => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, id)
    })
}

export const createUserService = async (user:tiUsers):Promise<string | null>   => {
    await db.insert(usersTable).values(user)
    return "User created successfully";
}

export const updateUserService = async (id: number, user: tiUsers):Promise<string | null>  => {
    await db.update(usersTable).set(user).where(eq(usersTable.user_id, id))
    return "User updated successfully";
}

export const deleteUserService = async (id: number):Promise<string | null>  => {
    await db.delete(usersTable).where(eq(usersTable.user_id, id))
    return "User deleted successfully";
}
