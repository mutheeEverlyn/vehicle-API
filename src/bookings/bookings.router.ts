import { Hono } from "hono";
import { listBookings, getBookings, createBookings, updateBookings,deleteBookings,getBookingsData } from "./bookings.controller"
import { zValidator } from "@hono/zod-validator";
import { bookingsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const bookingsRouter = new Hono();


bookingsRouter.get("/bookings",adminRoleAuth, listBookings);

bookingsRouter.get("/bookingsData",adminRoleAuth, getBookingsData);

bookingsRouter.get("/bookings/:id",userAdminRoleAuth, getBookings);

bookingsRouter.post("/bookings",zValidator('json',bookingsSchema,(result,c) =>{
    if(!result.success){
        return c.json(result.error,400)
    }
}) ,adminRoleAuth,createBookings);

bookingsRouter.put("/bookings/:id",adminRoleAuth, updateBookings);

bookingsRouter.delete("/bookings/:id",adminRoleAuth, deleteBookings);
