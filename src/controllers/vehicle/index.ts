import { Response } from "express";
import { db } from "../../db/db";
import { IRequest } from "../../types/main";
import { prismaErrorHandler } from "../../helpers/prismaErrorHandler";

export const createVehicle = async (req: IRequest, res: Response) => {
    const { name, licensePlate, type } = req.body;
    try {
        const v = await db.vehicle.create({
            data: {
                licensePlate: licensePlate,
                name: name,
                type: type,
                userId: req.user!.id
            }
        })

        return res.status(201).json({ message: 'created successfully', v })
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}

export const updateVehicle = async (req: IRequest, res: Response) => {
    const vehicle = req.body;
    try {
        await db.vehicle.update({
            data: {
                ...vehicle
            },
            where: {
                id: parseInt(req.params.id),
                userId: req.user?.id
            }
        })
        return res.status(200).json({ message: `updated ${Object.keys(vehicle).length} fields` });
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) })
    }
}

export const deleteVehicle = async (req: IRequest, res: Response) => {
    const { licensePlate } = req.body
    try {
        await db.vehicle.delete({
            where: { licensePlate: licensePlate, userId: req.user?.id }
        })

        return res.status(204).json({})
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}