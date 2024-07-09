import { Context } from "hono";
import { paymentsService, getPaymentsService, createPaymentsService, updatePaymentsService, deletePaymentsService,paymentsData} from "./payments.service";

export const listPayments = async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'))

        const data = await paymentsService(limit);
        if (data == null || data.length == 0) {
            return c.text("payments not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getPayments = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payments = await getPaymentsService(id);
    if (payments == undefined) {
        return c.text("payments not found", 404);
    }
    return c.json(payments, 200);
}

export const getPaymentsData = async (c: Context) => {
    try {
      const result = await paymentsData();
      return c.json(result, 200);
    } catch (error:any) {
      return c.json({ error: error?.message }, 500);
    }
  };
export const createPayments = async (c: Context) => {
    try {
        const payments = await c.req.json();
        const createdPayments = await createPaymentsService(payments);


        if (!createdPayments) return c.text("payments not created", 404);
        return c.json({ msg: createdPayments }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updatePayments = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payments = await c.req.json();
    try {
    
        const searchedPayments= await getPaymentsService(id);
        if (searchedPayments== undefined) return c.text("payments not found", 404);
        const res = await updatePaymentsService(id, payments)
        if (!res) return c.text("restaurant not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletePayments = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
       
        const restaurant = await getPaymentsService(id);
        if (restaurant == undefined) return c.text("restaurant not found", 404);
        const res = await deletePaymentsService(id);
        if (!res) return c.text("Restaurant not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}