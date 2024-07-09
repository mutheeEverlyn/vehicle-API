import { Hono } from "hono";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "./user.controller"
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators";
export const userRouter = new Hono();

userRouter.get("/users",adminRoleAuth, listUsers);

userRouter.get("/users/:id",userAdminRoleAuth, getUser); 
userRouter.post("/users",zValidator('json',userSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}), adminRoleAuth,createUser);  
userRouter.put("/users/:id",adminRoleAuth, updateUser);

userRouter.delete("/users/:id",adminRoleAuth, deleteUser);
