import cron from "node-cron";
import { db } from "../db/db";
import { endParkingMethod } from "../helpers/parkingHelper";
import { sendMail } from "./nodemailer";

const job = cron.schedule('* * * * * *', async () => {
    try {
        const activeParking = await db.parkingHistory.findMany({
            where: {
                endTime: null
            },
            include: {
                parkingZone: {
                    select: {
                        hourlyCost: true,
                        address: true
                    }
                },
                user: {
                    select: {
                        email: true,
                        balance: true,
                        id: true,
                    }
                }
            },
        });

        activeParking.map(async (p) => {
            const minuteCost = (parseInt(p.parkingZone.hourlyCost.toString()) / 60).toFixed(3);
            const newBalance = parseFloat(p.user.balance.toString()) - parseFloat(minuteCost);
            const shouldEnd = newBalance <= 0;


            await db.user.update({
                data: {
                    balance: shouldEnd ? 0 : newBalance
                },
                where: { id: p.user.id }
            });

            if (shouldEnd) {
                const elapsedMilliseconds: number = new Date().getTime() - p.startTime.getTime();
                const elapsedHours = (elapsedMilliseconds / (1000 * 60 * 60));
                const totalCost = (parseFloat(p.parkingZone.hourlyCost.toString()) * elapsedHours).toFixed(3);

                sendMail(p.user.email,
                    `you've ran out of balance, your parking at ${p.parkingZone.address} has ended.`,
                    'Insufficient Balance to continue parking');
                endParkingMethod(p.id, parseFloat(totalCost));
            }
        })
    } catch (error: any) {
        throw new Error(error.message)
    }
});

export default job;