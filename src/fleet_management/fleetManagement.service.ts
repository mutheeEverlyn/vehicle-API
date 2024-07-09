import { eq,sql } from "drizzle-orm";
import db from "../drizzle/db";
import {fleetManagementTable, tsFleetManagement,tiFleetManagement} from "../drizzle/schema"


export const fleetManagementService = async (limit?: number):Promise<tsFleetManagement[] | null> => {
    if (limit) {
        return await db.query.fleetManagementTable.findMany({
            limit: limit
        });
    }
    return await db.query.fleetManagementTable.findMany();
}

export const getFleetManagementService = async (id: number) => {
    return await db.query.fleetManagementTable.findFirst({
        where: eq(fleetManagementTable.fleet_id, id)
    })
}

//data

export const fleetManagementData= async () => {
    return await db.query.fleetManagementTable.findMany({
        columns:{
          acquisition_date:true,
          depreciation_rate:true,
          current_value:true,
          maintenance_cost:true,
          status:true,
          created_at:true,
          updated_at:true
        },
        with:{
            vehicle:{
                columns:{
                    availability:true,
                    created_at:true,
                    updated_at:true,
                    rental_rate:true,
                }
            }
        }
    })
}
export const createFleetManagementService = async (fleetManagement:any):Promise<string | null>  => {
    await db.insert(fleetManagementTable).values(fleetManagement)
    return "fleetManagement created successfully";
}

export const updateFleetManagementService = async (id: number, fleetManagement: any):Promise<string | null>  => {
    await db.update(fleetManagementTable).set(fleetManagement).where(eq(fleetManagementTable.fleet_id, id))
    return "fleetManagement updated successfully";
}

export const deleteFleetManagementService = async (id: number):Promise<string | null>  => {
    await db.delete(fleetManagementTable).where(eq(fleetManagementTable.fleet_id, id))
    return "fleetManagement deleted successfully";
}
