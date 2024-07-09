import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import Stripe from 'stripe';
import "dotenv/config";
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import {cors} from 'hono/cors'
import { trimTrailingSlash } from 'hono/trailing-slash';
import { timeout } from 'hono/timeout';
import { HTTPException } from 'hono/http-exception';
import { prometheus } from '@hono/prometheus';
import {rateLimiter} from 'hono-rate-limiter';
import { userRouter } from './users/user.router';
import { vehicleSpecificationsRouter } from './vehicle_specifications/vehicleSpecifications.router';
import { vehicleRouter } from './vehicles/vehicles.router';
import { bookingsRouter } from './bookings/bookings.router';
import { paymentsRouter } from './payments/payments.router';
import { customerSupportTicketsRouter  } from './customerSupportTickets/customerSupportTickets.router';
import { locationBranchesRouter  } from './locationBranches/locationBranches.router';
import { fleetManagementRouter } from './fleet_management/fleetManagement.router';
import { authRouter } from './auth/auth.router';
import { env } from 'hono/adapter'



const app = new Hono()

app.post('/webhook', async (context) => {
  const { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } =
    env(context)
  const stripe = new Stripe(STRIPE_SECRET_API_KEY)
  const signature = context.req.header('stripe-signature')
  try {
    if (!signature) {
      return context.text('', 400)
    }
    const body = await context.req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
    switch (event.type) {
      case 'payment_intent.created': {
        console.log(event.data.object)
        break
      }
      default:
        break
    }
    return context.text('', 200)
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : 'Internal server error'
    }`
    console.log(errorMessage)
    return context.text(errorMessage, 400)
  }
})

export default app


app.use(cors({
  origin: '*',
  allowMethods : ['GET','POST','PUT','DELETE','OPTIONS'],
  allowHeaders : ['Content-Type','Authorization'],
}));
const limiter = rateLimiter({
windowMs:1 * 60 *1000,
limit:3,
standardHeaders: "draft-6",
keyGenerator :(c) =>"<unique_key>"
});

const customTimeoutException = () =>
  new HTTPException(408, {
    message: `Request timeout `,
  })

const { printMetrics, registerMetrics } = prometheus()

// inbuilt middlewares
app.use(logger())  //logs request and response to the console
app.use(csrf()) //prevents CSRF attacks by checking request headers.
app.use(trimTrailingSlash()) //removes trailing slashes from the request URL
app.use('/', timeout(10000, customTimeoutException))
//3rd party middlewares
app.use('*', registerMetrics)


// default route
app.get('/',(c) =>{
  return c.html(`
    <!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>vehicle rental Management System</title>
 <style>
     body {
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 0;
         background-color: #f4f4f4;
         color: #333;
     }
     header {
         background-color: #007BFF;
         color: white;
         padding: 20px 0;
         text-align: center;
     }
     .container {
         max-width: 1200px;
         margin: 20px auto;
         padding: 20px;
         background: white;
         border-radius: 8px;
         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     }
     h1{
     color:#fff;
     }
      h2 {
         color: #007BFF;
     }
     .btn {
         display: inline-block;
         padding: 10px 20px;
         margin: 10px 0;
         background-color: #007BFF;
         color: white;
         text-decoration: none;
         border-radius: 5px;
         font-size:30px;
     }
         .btn a{
         text-decoration:none;
         }
     .btn:hover {
         background-color: #0056b3;
     }
     footer {
         text-align: center;
         padding: 20px 0;
         background-color: #007BFF;
         color: white;
         position: fixed;
         width: 100%;
         bottom: 0;
     }
 </style>
</head>
<body>
 <header>
     <h1>Welcome to Everlyn's rental vehicles Api</h1>
 </header>
 <div class="container">
     <h2>About</h2>
     <p>My API helps you access data of a vehicle rental management system.</p>
     
     <h2>Feel free to view the information by clicking the button below</h2>
     <button class="btn"><a href="">click here!</a></button>
 </div>
 <footer>
     <p>&copy; Everlyn Muthoni API. All rights reserved.</p>
 </footer>
</body>
</html>

 `)
})
app.get('/ok', (c) => {
  return c.text('The server is running!')
})
app.get('/timeout', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 11000))
  return c.text("data after 5 seconds", 200)
})
app.get('/metrics', printMetrics)

// custom route
app.route("/", userRouter)   // /users
app.route("/",  vehicleSpecificationsRouter)   
app.route("/",vehicleRouter )   
app.route("/",  bookingsRouter)   
app.route("/", paymentsRouter)   
app.route("/",customerSupportTicketsRouter )   
app.route("/",  locationBranchesRouter )   
app.route("/",fleetManagementRouter )  
app.route("/",authRouter) 


app.use(limiter);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT)
})
console.log(`Server is running on port ${process.env.PORT}`)
