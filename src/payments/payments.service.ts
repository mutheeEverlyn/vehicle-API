import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { paymentsTable, tsPayments,tiPayments, bookingsTable} from "../drizzle/schema"
import {stripe} from '../drizzle/db'
 
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
          payment_method:true,
          transaction_id:true,
          payment_id:true,
           amount:true,
           payment_status:true,
           payment_date:true,
           created_at:true,
           updated_at:true
        },with:{
           booking:{
                columns:{
                  user_id:true,
                  booking_id:true,
                  location_id:true,
                  vehicle_id:true,
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
export const createPaymentService = () => {
    return {
      async createCheckoutSession(booking_id: number, amount: number) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Car Booking",
                },
                unit_amount: amount * 100, // change amount to cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/payment-success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
          metadata: {
            booking_id: booking_id.toString(),
          },
        });
        const payment_intent = await stripe.paymentIntents.create({
                amount: Number(amount) * 100,
                currency: 'usd',
                metadata: { booking_id:booking_id.toString() },
              });
              await db.update(bookingsTable).set({ booking_status: "confirmed" }).where(eq(bookingsTable.booking_id, booking_id));
              await db.insert(paymentsTable).values({booking_id, amount: amount , payment_status: "confirmed",payment_method: 'credit card',transaction_id:payment_intent.id ,}) .execute();
        return session;
      },
  
      async handleSuccessfulPayment(session_id: string) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const booking_id = parseInt(session.metadata!.booking_id);
        const amount_total = session.amount_total;
        if (amount_total === null) {
          throw new Error("session.amount_total is null");
        }
      },
    };
  };
export const updatePaymentsService = async (id: number, payments: tiPayments):Promise<string | null>  => {
    await db.update(paymentsTable).set(payments).where(eq(paymentsTable.payment_id, id))
    return "payments updated successfully";
}

export const deletePaymentsService = async (id: number):Promise<string | null>  => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id))
    return "payments deleted successfully";
}
