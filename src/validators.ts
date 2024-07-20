import { z } from 'zod'

export const userSchema = z.object({
    full_name: z.string(),
    email: z.string(),
    contact_phone: z.string(),
    address:z.string(),
    password: z.string(),
    role: z.string(),
    created_at:z.string().optional(),
    updated_at:z.string().optional()
})

// export const vehicleSchema = z.object({
//     vehicleSpec_id: z.number(),
//     rental_rate: z.number(),
//     availability: z.string(),
//     created_at:z.string().optional(),
//     updated_at:z.string().optional(),
    
// })

export const vehicleSpecificationsSchema = z.object({
    manufacturer:z.string(),
    model:z.string(),
    year:z.number(),
    fuel_type:z.string(),
    engine_capacity:z.string(),
    transmission:z.string(),
    seating_capacity:z.number(),
    color:z.string(),
    features: z.string()
})

export const bookingsSchema = z.object({
    user_id: z.number(),
    vehicle_id: z.number(),
    location_id: z.number(),
    booking_date: z.string().optional(),
    return_date: z.string().optional(),
    total_amount: z.number(),
    booking_status: z.string().optional(),
    created_at:z.string().optional(),
    updated_at:z.string().optional(),
})

export const paymentsSchema = z.object({
    booking_id: z.number(),
    amount: z.number(),
    payment_status: z.string(),
    payment_date: z.string().optional(),
    payment_method: z.string(),
    transaction_id: z.string().optional(),
    created_at:z.string().optional(),
    updated_at:z.string().optional()
})
export const customerSupportTicketsSchema=z.object({
    user_id:z.number(),
    subject:z.string(),
    description:z.string(),
    status:z.string(),
    created_at:z.string().optional(),
    updated_at:z.string().optional()
})
export const locationBranchesSchema = z.object({
    name: z.string(),
    address: z.string(),
    contact_phone:z.string(),
    created_at:z.string().optional(),
    updated_at:z.string().optional()
})


export const fleetManagementSchema = z.object({
    vehicle_id: z.number(),
    acquisition_date: z.string(),
    depreciation_rate: z.number(),
    current_value:z.number(),
    maintenance_cost:z.number(),
    status: z.string(),
    created_at:z.string().optional(),
    updated_at:z.string().optional()
})


// export const loginUserSchema = z.object({
//      email: z.string(),
//     password: z.string()
// })

// export const registerUserSchema = z.object({
//     full_name: z.number(),
    
//     email: z.string(),
//     password: z.string(),
//     role: z.string().optional(),
// })