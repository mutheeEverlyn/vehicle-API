import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {vehicleSpecificationsTable, tsVehicleSpecifications,tiVehicleSpecifications} from "../drizzle/schema"


export const vehicleSpecificationsService = async (limit?: number):Promise<tsVehicleSpecifications[] | null> => {
    if (limit) {
        return await db.query.vehicleSpecificationsTable.findMany({
            limit: limit
        });
    }
    return await db.query.vehicleSpecificationsTable.findMany();
}

export const getVehicleSpecificationsService = async (id: number) => {
    return await db.query.vehicleSpecificationsTable.findFirst({
        where: eq(vehicleSpecificationsTable.vehicleSpec_id, id)
    })
}
//with columns
export const vehicleSpecificationsData = async () => {
    return await db.query.vehicleSpecificationsTable.findMany({
        columns:{
            manufacturer:true,
            model:true,
            year:true,
            fuel_type:true,
            engine_capacity:true,
            transmission:true,
            seating_capacity:true,
            color:true,
            features:true
        }
    });
}
export const createVehicleSpecificationsService = async (vehicleSpecifications:any):Promise<string | null>  => {
    await db.insert(vehicleSpecificationsTable).values(vehicleSpecifications)
    return "vehicle specifications created successfully";
}

export const updateVehicleSpecificationsService = async (id: number, vehicleSpecifications: any):Promise<string | null> => {
    await db.update(vehicleSpecificationsTable).set(vehicleSpecifications).where(eq(vehicleSpecificationsTable.vehicleSpec_id, id))
    return "vehicle specifications updated successfully";
}

export const deleteVehicleSpecificationsService = async (id: number):Promise<string | null> => {
    await db.delete(vehicleSpecificationsTable).where(eq(vehicleSpecificationsTable.vehicleSpec_id, id))
    return "vehicle specifications deleted successfully";
}
