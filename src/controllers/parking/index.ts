import { Response } from "express";
import { IRequest } from "../../types/main";
import { db } from "../../db/db";
import { prismaErrorHandler } from "../../helpers/prismaErrorHandler";
import { sendMail } from "../../lib/nodemailer";
import { endParkingMethod } from "../../helpers/parkingHelper";

export const startParking = async (req: IRequest, res: Response) => {
    const { parkingZoneId, vehicleId } = req.body;
    try {
        const [verify, user] = await db.$transaction([
            db.parkingHistory.count({
                where: {
                    parkingZoneId: parseInt(parkingZoneId),
                    vehicleId: parseInt(vehicleId),
                    userId: req.user.id,
                    endTime: null
                },
            }),
            db.user.findFirst({
                where: {
                    id: req.user.id,
                    balance: { gt: 0 }
                }
            }),
        ])

        if (verify > 0) return res.status(400).json({ message: 'end current parking to start a new one' });
        if (!user) return res.status(404).json({ message: "can't start the parking due to insufficient balance" })

        const verifyOwner = await db.vehicle.count({
            where: {
                userId: req.user.id,
                id: parseInt(vehicleId)
            }
        });
        if (verifyOwner === 0) return res.status(404).json({ message: 'no vehicle found' });

        const p = await db.parkingHistory.create({
            data: {
                parkingZoneId: parseInt(parkingZoneId),
                vehicleId: parseInt(vehicleId),
                userId: req.user.id,
            },
            include: {
                parkingZone: {
                    select: {
                        address: true,
                    }
                },
                vehicle: {
                    select: {
                        licensePlate: true,
                    }
                }
            }
        });

        sendMail(req.user.email, `You have started hourly parking at ${p.parkingZone.address} ${new Date().toLocaleString()}`,
            `Parking ${p.vehicle.licensePlate}`);

        return res.status(201).json({ message: `parking started ${p.vehicle.licensePlate}` })
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}

export const endParking = async (req: IRequest, res: Response) => {
    const { parkingZoneId, vehicleId } = req.body;

    try {
        const p = await db.parkingHistory.findFirst({
            where: {
                parkingZoneId: parseInt(parkingZoneId),
                vehicleId: parseInt(vehicleId),
                userId: req.user.id,
                endTime: null
            },
            include: {
                parkingZone: true
            }
        })
        if (!p) return res.status(404).json({ error: "invalid data" });

        const elapsedMilliseconds: number = new Date().getTime() - p.startTime.getTime();
        const elapsedHours = (elapsedMilliseconds / (1000 * 60 * 60));
        const totalCost = (parseFloat(p.parkingZone.hourlyCost.toString()) * elapsedHours).toFixed(3);
        const end = await endParkingMethod(p.id, parseFloat(totalCost));

        sendMail(req.user.email, `You have ended hourly parking at ${end.parkingZone.address} ${new Date().toLocaleString()}`,
            `Parking ${end.vehicle.licensePlate}`);

        return res.status(201).json({ message: `parking ended ${end.vehicle.licensePlate}` })
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}