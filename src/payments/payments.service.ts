import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { paymentsTable, tsPayments,tiPayments} from "../drizzle/schema"
import {stripe} from '../drizzle/db'
import { error } from "console";



  
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



export const createPaymentsService = async (paymentData: tiPayments) => {
    if (paymentData.booking_id === undefined) {
      throw new Error("Booking id required");
    }
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(paymentData.amount) * 100,
      currency: 'usd',
      metadata: { booking_id: paymentData.booking_id.toString() }, // Ensure booking_id is a string
    });
  
    await db.insert(paymentsTable).values({
      booking_id: paymentData.booking_id,
      amount: paymentData.amount,
      payment_status: 'Pending',
      payment_method: paymentData.payment_method,
      transaction_id: paymentIntent.id,
      payment_date: new Date(),
    }).execute();
  
    return { message: 'Payment created successfully', client_secret: paymentIntent.client_secret };
  };
export const updatePaymentsService = async (id: number, payments: any):Promise<string | null>  => {
    await db.update(paymentsTable).set(payments).where(eq(paymentsTable.payment_id, id))
    return "payments updated successfully";
}

export const deletePaymentsService = async (id: number):Promise<string | null>  => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id))
    return "payments deleted successfully";
}
