import { Hono } from "hono";
import { listVehicle, getVehicle, createVehicle, updateVehicle, deleteVehicle,vehicle} from "./vehicles.controller"
import { zValidator } from "@hono/zod-validator";
import { vehicleSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const vehicleRouter = new Hono();


vehicleRouter.get("/vehicle", userAdminRoleAuth, listVehicle);
vehicleRouter.get("/vehicle/:id",userAdminRoleAuth, getVehicle);
vehicleRouter.post("/vehicle",zValidator('json',vehicleSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}),adminRoleAuth, createVehicle);
vehicleRouter.put("/vehicle/:id",adminRoleAuth, updateVehicle);

vehicleRouter.delete("/vehicle/:id",adminRoleAuth, deleteVehicle);
//with
vehicleRouter.get("/vehicleData", adminRoleAuth, vehicle);