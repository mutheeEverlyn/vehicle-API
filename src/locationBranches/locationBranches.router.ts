import { Hono } from "hono";
import { listLocationBranches, getLocationBranches, createLocationBranches, updateLocationBranches, deletelocationBranches} from "./locationBranches.controller"
import { zValidator } from "@hono/zod-validator";
import { locationBranchesSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const locationBranchesRouter = new Hono();

locationBranchesRouter.get("/locationBranches",adminRoleAuth,listLocationBranches);
// locationBranchesRouter.get("/locationBranchesData",adminRoleAuth,getLocationBranchesData);

locationBranchesRouter.get("/locationBranches/:id",adminRoleAuth, getLocationBranches)

locationBranchesRouter.post("/locationBranches",zValidator('json',locationBranchesSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}),adminRoleAuth, createLocationBranches)
locationBranchesRouter.put("/locationBranches/:id",adminRoleAuth, updateLocationBranches)

locationBranchesRouter.delete("/locationBranches/:id",adminRoleAuth, deletelocationBranches)

