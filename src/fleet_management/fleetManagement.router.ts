import { Hono } from "hono";
import { listFleetManagement, getFleetManagement, createFleetManagement, updateFleetManagement, deleteFleetManagement,getFleetManagementData  } from "./fleetManagement.controller"
import { zValidator } from "@hono/zod-validator";
import { fleetManagementSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const fleetManagementRouter = new Hono();


fleetManagementRouter.get("/fleetManagement",adminRoleAuth, listFleetManagement);

fleetManagementRouter.get("/fleetManagement/:id",adminRoleAuth, getFleetManagement);

fleetManagementRouter.post("/fleetManagement",zValidator('json',fleetManagementSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}),adminRoleAuth, createFleetManagement);
fleetManagementRouter.put("/fleetManagement/:id",adminRoleAuth, updateFleetManagement);

fleetManagementRouter.delete("/fleetManagement/:id",adminRoleAuth, deleteFleetManagement);
fleetManagementRouter.get("/fleetManagementData",adminRoleAuth, getFleetManagementData );