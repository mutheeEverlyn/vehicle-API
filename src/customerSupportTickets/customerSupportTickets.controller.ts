import { Context } from "hono";
import { customerSupportTicketsService, getCustomerSupportTicketsService, createCustomerSupportTicketsService, updateCustomerSupportTicketsService, deleteCustomerSupportTicketsService,customerSupportTicketsData } from "./customerSupportTickets.service";

export const listCustomerSupportTickets= async (c: Context) => {
    try {
        const limit = Number(c.req.query('limit'))

        const data = await customerSupportTicketsService(limit);
        if (data == null || data.length == 0) {
            return c.text("CustomerSupportTickets not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getCustomerSupportTickets= async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const orders = await getCustomerSupportTicketsService(id);
    if (orders== undefined) {
        return c.text("CustomerSupportTickets not found", 404);
    }
    return c.json(orders, 200);
}

// data
export const customerSupportTickets = async (c: Context) => {
    try {
        const data= await customerSupportTicketsData();
        if (data == null || data.length == 0){
        return c.text("CustomerSupportTickets not found", 404);
        }
        return c.json(data,200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
export const createCustomerSupportTickets = async (c: Context) => {
    try {
        const customerSupportTickets = await c.req.json();
        const createdCustomerSupportTickets = await createCustomerSupportTicketsService(customerSupportTickets);


        if (!createdCustomerSupportTickets) return c.text("CustomerSupportTickets not created", 404);
        return c.json({ msg: createdCustomerSupportTickets}, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateCustomerSupportTickets = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const customerSupportTickets = await c.req.json();
    try {
        const searchedCustomerSupportTickets = await getCustomerSupportTicketsService(id);
        if (searchedCustomerSupportTickets == undefined) return c.text("CustomerSupportTickets not found", 404);
        // get the data and update it
        const res = await updateCustomerSupportTicketsService(id, customerSupportTickets);
        if (!res) return c.text("CustomerSupportTickets not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteCustomerSupportTickets= async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
       
        const customerSupportTickets = await getCustomerSupportTicketsService(id);
        if (customerSupportTickets== undefined) return c.text("CustomerSupportTickets not found", 404);
        
        const res = await deleteCustomerSupportTicketsService(id);
        if (!res) return c.text("CustomerSupportTickets not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}