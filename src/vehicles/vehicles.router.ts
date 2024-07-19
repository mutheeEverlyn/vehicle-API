import { Hono } from "hono";
import { listVehicle, getVehicle, createVehicle, updateVehicle, deleteVehicle,vehicle} from "./vehicles.controller"
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const vehicleRouter = new Hono();


vehicleRouter.get("/vehicle", userAdminRoleAuth, listVehicle);
vehicleRouter.get("/vehicle/:id",userAdminRoleAuth, getVehicle);
vehicleRouter.post("/vehicle",adminRoleAuth, createVehicle);
vehicleRouter.put("/vehicle/:id",adminRoleAuth, updateVehicle);

vehicleRouter.delete("/vehicle/:id",adminRoleAuth, deleteVehicle);
//with
vehicleRouter.get("/vehicleData", userAdminRoleAuth, vehicle);