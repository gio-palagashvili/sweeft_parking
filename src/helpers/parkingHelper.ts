import { db } from "../db/db"

export const endParkingMethod = async (id: number, amountPaid: number) => {
    const p = await db.parkingHistory.update({
        data: {
            endTime: new Date(),
            amountPaid: amountPaid
        },
        where: {
            id: id
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

    return p;
}