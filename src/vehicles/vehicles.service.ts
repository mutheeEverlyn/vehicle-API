import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { z } from 'zod';
import {vehiclesTable, tsVehicle,tiVehicle,vehicleSpecificationsTable} from "../drizzle/schema"

const vehicleSchema=z.object({
rental_rate:z.number(),
availability:z.string(),
manufacturer:z.string(),
model:z.string(),
year:z.number(),
fuel_type: z.string(),
engine_capacity:z.string(),
transmission:z.string(),
seating_capacity:z.number(),
color:z.string(),
images:z.string(),
features:z.string(),
})
type vehicleInfo=z.infer<typeof vehicleSchema>;
export const createVehicleService=async(vehicle:vehicleInfo):Promise<number|null>=>{
    const parsedData=vehicleSchema.parse(vehicle);
    const vehicleRecord=await db.insert(vehicleSpecificationsTable).values({
    manufacturer:parsedData.manufacturer,
    model:parsedData.model,
    year:parsedData.year,
    fuel_type:parsedData.fuel_type,
    engine_capacity:parsedData.engine_capacity,
    transmission:parsedData.transmission,
    seating_capacity:parsedData.seating_capacity,
    color:parsedData.color,
    images:parsedData.images,
    features:parsedData.features,
    }).returning({vehicleSpec_id:vehicleSpecificationsTable.vehicleSpec_id})
    const vehicleSpec_id=vehicleRecord[0]?.vehicleSpec_id;
    if(!vehicleSpec_id) return null;
    await db.insert(vehiclesTable).values({
    vehicleSpec_id:vehicleSpec_id,
    rental_rate: parsedData.rental_rate,
    availability:parsedData.availability,  
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
    })
    return vehicleSpec_id;
};
export const vehicleService = async (limit?: number):Promise<tsVehicle[] | null> => {
    if (limit) {
        return await db.query.vehiclesTable.findMany({
            limit: limit
        });
    }
    return await db.query.vehiclesTable.findMany();
}

export const getVehicleService = async (id: number)  => {
    return await db.query.vehiclesTable.findFirst({
        where: eq(vehiclesTable.vehicle_id, id)
    })
}
//with
export const vehicleData= async () => {
    return await db.query.vehiclesTable.findMany({
        columns:{
              vehicle_id:true,
              rental_rate:true,
              availability:true,
              created_at:true,
              updated_at:true
        },
        with:{
            specification:{
                columns:{
                    manufacturer:true,
                    model:true,
                    year:true,
                    fuel_type:true, 
                    engine_capacity:true,
                    transmission:true,
                    seating_capacity:true,
                    color:true,
                    images:true,
                    features:true,
                }
            }
        },
    })
  
}

// export const createVehicleService = async (vehicle:tiVehicle):Promise<string | null>   => {
//     await db.insert(vehiclesTable).values(vehicle)
//     return "vehicle created successfully";
// }

export const updateVehicleService = async (id: number, vehicle:tiVehicle):Promise<string | null>  => {
    await db.update(vehiclesTable).set(vehicle).where(eq(vehiclesTable.vehicle_id, id))
    return "vehicle updated successfully";
}

export const deleteVehicleService = async (id: number):Promise<string | null>  => {
    await db.delete(vehiclesTable).where(eq(vehiclesTable.vehicle_id, id))
    return "vehicle deleted successfully";
}
