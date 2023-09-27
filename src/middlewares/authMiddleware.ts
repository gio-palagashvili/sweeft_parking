import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IJwtPayload, IRequest } from "../types/main";
import { User } from "@prisma/client";

export const authMiddleware = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers.authorization)
            return res.status(401).json({ errorMessage: "no token" });

        const token = req.headers.authorization.split(" ")[1] as string;
        const user = jwt.verify(token, process.env.JWT_KEY as string) as IJwtPayload
        req.user = user.data as User;

        next();
    } catch (error: any) {
        return res.status(401).json({ message: 'invalid token' })
    }
};

export const adminAuthMiddleware = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers.authorization)
            return res.status(404).json({ errorMessage: "no token" });

        const token = req.headers.authorization.split(" ")[1] as string;
        const user = (jwt.verify(token, process.env.JWT_KEY as string) as IJwtPayload).data as User;
        if (user.role != "ADMIN") return res.status(401).json({ message: 'not authorized' });

        req.user = user;

        next();
    } catch (error: any) {
        return res.status(401).json({ message: 'invalid token' })
    }
};
