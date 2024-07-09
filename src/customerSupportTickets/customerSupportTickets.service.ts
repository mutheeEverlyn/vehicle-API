import { Column, eq, gt, sql } from "drizzle-orm";
import db from "../drizzle/db";
import {customerSupportTicketsTable, tsCustomerSupportTickets,tiCustomerSupportTickets} from "../drizzle/schema"


export const customerSupportTicketsService = async (limit?: number):Promise<tsCustomerSupportTickets [] | null> => {
    if (limit) {
        return await db.query.customerSupportTicketsTable.findMany({
            limit: limit
        });
    }
    return await db.query.customerSupportTicketsTable.findMany();
}

export const getCustomerSupportTicketsService = async (id: number) => {
    return await db.query.customerSupportTicketsTable.findFirst({
        where: eq(customerSupportTicketsTable.ticket_id, id)
    })
}



export const customerSupportTicketsData = async () => {
    return await db.query.customerSupportTicketsTable.findMany({
        columns:{
           subject:true,
           description:true,
           status:true,
           updated_at:true,
           created_at:true,
        },with:{
           user:{
                columns:{
                   address:true,
                   contact_phone:true,
                   created_at:true,
                   email:true,
                   full_name:true,
                   updated_at:true
                }
            }
        }
    })
}
export const createCustomerSupportTicketsService = async (customerSupportTickets:any):Promise<string | null>  => {
    await db.insert(customerSupportTicketsTable).values(customerSupportTickets)
    return "CustomerSupportTickets created successfully";
}

export const updateCustomerSupportTicketsService = async (id: number, customerSupportTickets: any):Promise<string | null> => {
    await db.update(customerSupportTicketsTable).set(customerSupportTickets).where(eq(customerSupportTicketsTable.ticket_id, id))
    return "CustomerSupportTickets updated successfully";
}

export const deleteCustomerSupportTicketsService = async (id: number):Promise<string | null>  => {
    await db.delete(customerSupportTicketsTable).where(eq(customerSupportTicketsTable.ticket_id, id))
    return "CustomerSupportTickets deleted successfully";
}
