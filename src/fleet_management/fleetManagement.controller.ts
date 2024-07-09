import { Context } from "hono";
import { fleetManagementService, getFleetManagementService, createFleetManagementService, updateFleetManagementService, deleteFleetManagementService,fleetManagementData } from "./fleetManagement.service";

export const listFleetManagement= async (c: Context) => {
    try {
      

        const limit = Number(c.req.query('limit'))

        const data = await fleetManagementService(limit);
        if (data == null || data.length == 0) {
            return c.text("FleetManagement not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getFleetManagement = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const fleetManagement = await getFleetManagementService(id);
    if (fleetManagement == undefined) {
        return c.text("FleetManagement not found", 404);
    }
    return c.json(fleetManagement, 200);
}

//data
export const getFleetManagementData = async (c: Context) => {
    try {
        const data= await fleetManagementData();
        if (data == null || data.length == 0){
        return c.text("FleetManagement not found", 404);
        }
        return c.json(data,200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
export const createFleetManagement = async (c: Context) => {
    try {
        const fleetManagement = await c.req.json();
        const createdFleetManagement = await createFleetManagementService(fleetManagement);


        if (!createFleetManagement) return c.text("FleetManagement not created", 404);
        return c.json({ msg: createdFleetManagement }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateFleetManagement = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const fleetManagement= await c.req.json();
    try {
       
        const searchedFleetManagement = await getFleetManagementService(id);
        if (searchedFleetManagement== undefined) return c.text("FleetManagement not found", 404);
        const res = await updateFleetManagementService(id, fleetManagement);
        if (!res) return c.text("FleetManagement not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteFleetManagement= async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        
        const fleetManagement = await getFleetManagementService(id);
        if (fleetManagement == undefined) return c.text("FleetManagement not found", 404);
        const res = await deleteFleetManagementService(id);
        if (!res) return c.text("FleetManagement not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}