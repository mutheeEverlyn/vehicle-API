import { Hono } from "hono";
import { listLocationBranches, getLocationBranches, createLocationBranches, updateLocationBranches, deletelocationBranches} from "./locationBranches.controller"
import { zValidator } from "@hono/zod-validator";
import { locationBranchesSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const locationBranchesRouter = new Hono();

locationBranchesRouter.get("/locationBranches",userAdminRoleAuth,listLocationBranches);
locationBranchesRouter.get("/locationBranches/:id",userAdminRoleAuth, getLocationBranches);
locationBranchesRouter.post("/locationBranches",zValidator('json',locationBranchesSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}),adminRoleAuth, createLocationBranches);
locationBranchesRouter.put("/locationBranches/:id",adminRoleAuth, updateLocationBranches);
locationBranchesRouter.delete("/locationBranches/:id",adminRoleAuth, deletelocationBranches);

