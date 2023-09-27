import { Request, Response } from "express";
import { db } from "../../db/db";
import { comparePass, generateRandomLinkToken, signJWT, stripUser, toHash } from "../../helpers/authHelper";
import { sendMail } from "../../lib/nodemailer";
import { User } from "@prisma/client";
import { IRequest } from "../../types/main";
import { prismaErrorHandler } from "../../helpers/prismaErrorHandler";

const setUserToken = async (token: boolean = false, email: string) => {
    const randomToken = generateRandomLinkToken();
    let now = new Date();

    await db.user.update({
        data: {
            resetToken: token ? randomToken : null,
            resetTokenExpDate: token ? new Date(now.setMinutes(now.getMinutes() + 5)) : null,
        }, where: { email: email }
    })

    if (token) sendMail(email, `http://localhost:5500/user/reset/${randomToken}`, 'Parking app password reset link')
}

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (await db.user.findFirst({ where: { email: email } })) return res.status(400).json({ error: "Email already exists" });
        const hashed = await toHash(password);
        const user: User | null = await db.user.create({
            data: {
                email: email,
                password: hashed
            }
        })
        return res.status(200).json({ message: `user ${user.email} created` });
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user: User | null = await db.user.findFirst({
            where: { email: email }
        });

        if (!user) return res.status(404).json({ error: 'Invalid credentials' });
        if (!await comparePass(password, user.password)) return res.status(404).json({ error: 'Invalid credentials' });

        return res.status(200).json({ token: await signJWT({ data: stripUser(user as User) }) });
    } catch (error: any) {
        return res.status(400).json({ error: prismaErrorHandler(error) });
    }
}

export const getUserHistory = async (req: IRequest, res: Response) => {
    try {
        const h = await db.parkingHistory.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                vehicle: {
                    select: {
                        licensePlate: true
                    }
                },
                parkingZone: {
                    select: {
                        address: true
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });


        return res.status(200).json({ data: h });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const resetPasswordToken = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user: User | null = await db.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) return res.status(200).json({ message: "if a user with this email exists they will recieve an email." })
        if (user.resetTokenExpDate && user.resetTokenExpDate > new Date()) {
            return res.status(200).json({ message: "if a user with this email exists they will recieve an email." })
        }

        setUserToken(true, email);
        return res.status(200).json({ message: "if a user with this email exists they will recieve an email." })
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await db.user.findFirst({
            where: {
                resetTokenExpDate: {
                    gt: new Date()
                },
                resetToken: token
            }
        })
        if (!user) return res.status(404).json({ message: 'invalid token' });
        await db.user.update({
            data: {
                password: await toHash(password)
            },
            where: { email: user.email }
        })

        setUserToken(false, user.email)
        sendMail(user.email, 'password reset successfully', 'password change')

        return res.status(200).json({ message: 'password reset successfully' });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}

export const toAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (await db.user.findFirst({ where: { email: email } })) return res.status(400).json({ error: "Email already exists" });
        const hashed = await toHash(password);
        const user: User | null = await db.user.create({
            data: {
                email: email,
                password: hashed,
                role: "ADMIN"
            }
        })
        return res.status(200).json({ message: `admin ${user.email} created` });
    } catch (error: any) {
        return res.status(400).json({
            error: prismaErrorHandler(error)
        });
    }
}