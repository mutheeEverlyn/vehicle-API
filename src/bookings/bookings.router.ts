import { Hono } from "hono";
import { listBookings, getBookings, createBookings, updateBookings,deleteBookings,getBookingsData } from "./bookings.controller"
import { zValidator } from "@hono/zod-validator";
import { bookingsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const bookingsRouter = new Hono();


bookingsRouter.get("/bookings",userAdminRoleAuth, listBookings);

bookingsRouter.get("/bookingsData",userAdminRoleAuth, getBookingsData);

bookingsRouter.get("/bookings/:id",userAdminRoleAuth, getBookings);

bookingsRouter.post("/bookings",zValidator('json',bookingsSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}) ,userRoleAuth,createBookings);

bookingsRouter.put("/bookings/:id",userRoleAuth, updateBookings);

bookingsRouter.delete("/bookings/:id",userRoleAuth, deleteBookings);
