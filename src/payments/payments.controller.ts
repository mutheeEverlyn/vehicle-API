import { Context } from "hono";
import Stripe from 'stripe';
import { paymentsService, getPaymentsService, createPaymentService, updatePaymentsService, deletePaymentsService,paymentsData} from "./payments.service";
const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
    apiVersion: '2024-06-20',
  });
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

const paymentService = createPaymentService();

export const createPayment = {
  async createCheckoutSession(c: Context) {
    try {
      const { booking_id, amount } = await c.req.json();
      console.log(
       ` Check if id and amount is being received: ${booking_id}, amount: ${amount}`
      );

      const session = await paymentService.createCheckoutSession(
        booking_id,
        amount
      );

      return c.json({ sessionId: session.id , checkoutUrl: session.url});
     
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return c.json(
        { success: false, error: "Failed to create checkout session" },
        500
      );
    }
  },
  //testing of checkout session

  async testCreateCheckoutSession(c: Context) {
    try {
      // For testing, we'll use hardcoded values
      const booking_id = 1;
      const amount = 10000; // $100
      console.log(
        `Testing checkout session inpts for bookingId: ${booking_id}, amount: ${amount}`
      );

      const session = await paymentService.createCheckoutSession(
        booking_id,
        amount
      );
      ///trying to update data on mytables once successful
      await paymentService.handleSuccessfulPayment(session.id);

      return c.json({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return c.json(
        { success: false, error: "Failed to create checkout session" },
        500
      );
    }
  },

  ///end of test

  async handleWebhook(c: Context) {
    const sig = c.req.header("stripe-signature");
    const rawBody = await c.req.raw.text();

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        await paymentService.handleSuccessfulPayment(session.id);
      }

      return c.json({ received: true });
    } catch (err) {
      console.error(err);
      return c.json({ error: "Webhook error" }, 400);
    }
  },
};
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