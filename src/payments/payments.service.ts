import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { paymentsTable, tsPayments,tiPayments} from "../drizzle/schema"


export const paymentsService = async (limit?: number):Promise<tsPayments[] | null> => {
    if (limit) {
        return await db.query.paymentsTable.findMany({
            limit: limit
        });
    }
    return await db.query.paymentsTable.findMany();
}

export const getPaymentsService = async (id: number) => {
    return await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.payment_id, id)
    })
}
export const paymentsData= async ()  => {
    return await db.query.paymentsTable.findMany({
        columns:{
           amount:true,
           payment_status:true,
           payment_date:true,
           created_at:true,
           updated_at:true
        },with:{
           booking:{
                columns:{
                  booking_date:true,
                  return_date:true,
                  total_amount:true,
                  booking_status:true,
                  created_at:true,
                  updated_at:true
                }
            }
        }
    })
}


export const createPaymentsService = async (payments:any):Promise<string | null>  => {
    await db.insert(paymentsTable).values(payments)
    return "payments created successfully";
}

export const updatePaymentsService = async (id: number, payments: any):Promise<string | null>  => {
    await db.update(paymentsTable).set(payments).where(eq(paymentsTable.payment_id, id))
    return "payments updated successfully";
}

export const deletePaymentsService = async (id: number):Promise<string | null>  => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id))
    return "payments deleted successfully";
}
