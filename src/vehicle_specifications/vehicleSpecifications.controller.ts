import { Context } from "hono";
import { vehicleSpecificationsService, getVehicleSpecificationsService, createVehicleSpecificationsService, updateVehicleSpecificationsService, deleteVehicleSpecificationsService,vehicleSpecificationsData } from "./vehicleSpecifications.service";

export const listVehicleSpecifications= async (c: Context) => {
    try {

        const limit = Number(c.req.query('limit'))

        const data = await vehicleSpecificationsService(limit);
        if (data == null || data.length == 0) {
            return c.text("vehicle specifications not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getVehicleSpecifications= async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicleSpecifications = await getVehicleSpecificationsService(id);
    if (vehicleSpecifications == undefined) {
        return c.text("vehicle specifications not found", 404);
    }
    return c.json(vehicleSpecifications, 200);
}

export const getVehicleSpecificationsData= async (c: Context) => {
    try {
        const data = await vehicleSpecificationsData();
        if (data == null || data.length == 0) {
            return c.text("vehicle specifications not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
export const createVehicleSpecifications= async (c: Context) => {
    try {
        const vehicleSpecifications = await c.req.json();
        const createdVehicleSpecifications = await createVehicleSpecificationsService(vehicleSpecifications);


        if (!createdVehicleSpecifications) return c.text("vehicle specifications not created", 404);
        return c.json({ msg: createdVehicleSpecifications}, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateVehicleSpecifications = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicleSpecifications= await c.req.json();
    try {
        const searchedVehicleSpecifications = await getVehicleSpecificationsService(id);
        if (searchedVehicleSpecifications == undefined) return c.text("vehicle specifications not found", 404);
        const res = await updateVehicleSpecificationsService(id, vehicleSpecifications);
        if (!res) return c.text("vahicle specifications not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteVehicleSpecifications = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const vehicleSpecifications = await getVehicleSpecificationsService(id);
        if (vehicleSpecifications == undefined) return c.text("vehicleSpecifications not found", 404);

        const res = await deleteVehicleSpecificationsService(id);
        if (!res) return c.text("vehicle specifications not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}