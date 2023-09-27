import { Response } from "express";
import { db } from "../../db/db";
import { prismaErrorHandler } from "../../helpers/prismaErrorHandler";
import { IRequest } from "../../types/main";
import { parkingZone } from "@prisma/client";

export const createParkingZone = async (req: IRequest, res: Response) => {
    const { name, address, hourlyCost } = req.body;

    try {
        const p = await db.parkingZone.create({
            data: {
                address,
                hourlyCost,
                name
            }, select: {
                id: true,
                address: true,
                hourlyCost: true,
                name: true,
            }
        })
        return res.status(201).json({ p })
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}

export const updateParkingZone = async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const parkingZone = req.body;

    try {
        await db.parkingZone.update({
            data: {
                ...parkingZone
            },
            where: {
                id: parseInt(id)
            },
        })

        return res.status(200).json({ message: `updated ${Object.keys(req.body).length} fields` });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const getParkingZoneHistory = async (req: IRequest, res: Response) => {
    const { id } = req.params;
    try {
        const data = await db.parkingZone.findMany({
            where: {
                id: parseInt(id)
            },
            include: {
                parkingHistory: true
            }
        });

        return res.status(200).json({ data });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const getParkingZones = async (req: IRequest, res: Response) => {
    try {
        const data = await db.parkingZone.findMany({
        });

        return res.status(200).json({ data });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const deleteParkingZone = async (req: IRequest, res: Response) => {
    const { id } = req.params;
    try {
        const p: parkingZone = await db.parkingZone.delete({
            where: {
                id: parseInt(id),
            }
        })
        return res.status(200).json({ message: `deleted parking zone ${p.name}` })
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}