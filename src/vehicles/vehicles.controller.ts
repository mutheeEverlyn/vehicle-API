import { Context } from "hono";
import { vehicleService, getVehicleService, createVehicleService, updateVehicleService, deleteVehicleService,vehicleData } from "./vehicles.service";

export const listVehicle= async (c: Context) => {
    try {

        const limit = Number(c.req.query('limit'))

        const data = await vehicleService(limit);
        if (data == null || data.length == 0) {
            return c.text("vehicle not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicle = await getVehicleService(id);
    if (vehicle == undefined) {
        return c.text("Vehicle not found", 404);
    }
    return c.json(vehicle, 200);
}
//with
export const vehicle= async (c: Context) => {
    try {
        const data = await vehicleData();
        if (data == null || data.length == 0) {
            return c.text("vehicle not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
export const createVehicle= async (c: Context) => {
    try {
        const vehicle = await c.req.json();
        const createdVehicle= await createVehicleService(vehicle);


        if (!createdVehicle) return c.text("vehicle not created", 404);
        return c.json({ msg: createdVehicle}, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateVehicle = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicle = await c.req.json();
    try {
        const searchedVehicle = await getVehicleService(id);
        if (searchedVehicle == undefined) return c.text("vehicle not found", 404);
        const res = await updateVehicleService(id, vehicle);
        if (!res) return c.text("Vehicle not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteVehicle = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const vehicle = await getVehicleService(id);
        if (vehicle== undefined) return c.text("Vehicle not found", 404);
        const res = await deleteVehicleService(id);
        if (!res) return c.text("Vehicle not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}