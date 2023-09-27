import { Admin, User } from "@prisma/client";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IRequest extends Request {
    user?: User | null | Admin;
}

export interface IJwtPayload extends JwtPayload {
    data: User | Admin
}


