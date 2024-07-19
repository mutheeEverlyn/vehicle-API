import { Hono } from "hono";
import { listPayments, getPayments, createPayment, updatePayments, deletePayments,getPaymentsData} from "./payments.controller"
import { zValidator } from "@hono/zod-validator";
import { paymentsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth,userAdminRoleAuth} from "../middleware/bearAuth";
export const paymentsRouter = new Hono();

paymentsRouter .get("/payments",userAdminRoleAuth, listPayments);
paymentsRouter .get("/payments/:id",userAdminRoleAuth, getPayments)
paymentsRouter .put("/payments/:id",adminRoleAuth,updatePayments)
paymentsRouter .delete("/payments/:id",adminRoleAuth, deletePayments)
paymentsRouter .get("/paymentsData",userAdminRoleAuth,getPaymentsData);
paymentsRouter.post("/create-checkout-session",createPayment.createCheckoutSession);
  paymentsRouter.post("/webhook", createPayment.handleWebhook);
  paymentsRouter.get( "/test-checkout-session",createPayment.testCreateCheckoutSession);