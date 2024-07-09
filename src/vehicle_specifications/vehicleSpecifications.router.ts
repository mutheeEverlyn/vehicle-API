import { Hono } from "hono";
import { listVehicleSpecifications, getVehicleSpecifications, createVehicleSpecifications, updateVehicleSpecifications, deleteVehicleSpecifications,getVehicleSpecificationsData} from "./vehicleSpecifications.controller"
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecificationsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const vehicleSpecificationsRouter = new Hono();


vehicleSpecificationsRouter .get("/vehicleSpecifications",userAdminRoleAuth, listVehicleSpecifications);
vehicleSpecificationsRouter .get("/vehicleSpecifications/:id",userAdminRoleAuth, getVehicleSpecifications);
vehicleSpecificationsRouter .post("/vehicleSpecifications",zValidator('json',vehicleSpecificationsSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}),adminRoleAuth, createVehicleSpecifications);
vehicleSpecificationsRouter .put("/vehicleSpecifications/:id",adminRoleAuth, updateVehicleSpecifications);

vehicleSpecificationsRouter .delete("/vehicleSpecifications/:id",adminRoleAuth, deleteVehicleSpecifications);
vehicleSpecificationsRouter .get("/vehicleSpecificationsData",userAdminRoleAuth, getVehicleSpecificationsData);
