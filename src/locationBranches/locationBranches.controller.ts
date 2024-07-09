import { Context } from "hono";
import { locationBranchesService, getLocationBranchesService, createLocationBranchesService, updateLocationBranchesService, deleteLocationBranchesService } from "./locationBranches.service";

export const listLocationBranches= async (c: Context) => {
    try {
       

        const limit = Number(c.req.query('limit'))

        const data = await locationBranchesService(limit);
        if (data == null || data.length == 0) {
            return c.text("locationBranches not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getLocationBranches = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const locationBranches = await getLocationBranchesService(id);
    if (locationBranches== undefined) {
        return c.text("location and branches not found", 404);
    }
    return c.json(locationBranches, 200);
}
// data
// export const getLocationBranchesData= async (c: Context) => {
//     try {
//         const data= await locationBranchesData();
//         if (data == null || data.length == 0){
//         return c.text("locationBranchesData not found", 404);
//         }
//         return c.json(data,200);
//     } catch (error: any) {
//         return c.json({ error: error?.message }, 400)
//     }
// }
export const createLocationBranches = async (c: Context) => {
    try {
        const locationBranches= await c.req.json();
        const createdLocationBranches = await createLocationBranchesService(locationBranches);


        if (!createdLocationBranches) return c.text("locationBranches not created", 404);
        return c.json({ msg: createdLocationBranches }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateLocationBranches= async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const locationBranches = await c.req.json();
    try {
        
        const searchedLocationBranches= await getLocationBranchesService(id);
        if (searchedLocationBranches == undefined) return c.text("locationBranches not found", 404);
        const res = await updateLocationBranchesService(id, locationBranches);
        if (!res) return c.text("locationBranches not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deletelocationBranches= async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const locationBranches = await getLocationBranchesService(id);
        if (locationBranches== undefined) return c.text("locationBranches not found", 404);
        const res = await deleteLocationBranchesService(id);
        if (!res) return c.text("locationBranches not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}