import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {vehiclesTable, tsVehicle,tiVehicle} from "../drizzle/schema"


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
                    features:true,
                }
            }
        },
    })
    
}

export const createVehicleService = async (vehicle:any):Promise<string | null>   => {
    await db.insert(vehiclesTable).values(vehicle)
    return "vehicle created successfully";
}

export const updateVehicleService = async (id: number, vehicle: any):Promise<string | null>  => {
    await db.update(vehiclesTable).set(vehicle).where(eq(vehiclesTable.vehicle_id, id))
    return "vehicle updated successfully";
}

export const deleteVehicleService = async (id: number):Promise<string | null>  => {
    await db.delete(vehiclesTable).where(eq(vehiclesTable.vehicle_id, id))
    return "vehicle deleted successfully";
}
