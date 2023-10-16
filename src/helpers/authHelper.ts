import bcrypt, { genSalt } from "bcrypt";
import { IJwtPayload } from "../types/main";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const toHash = async (password: string) => {
    try {
        const salt = await genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error: any) {
        throw new Error(error);
    }
}

export const comparePass = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error: any) {
        throw new Error(error);
    }
}

export const signJWT = async (payload: IJwtPayload, exp: string = process.env.JWT_EXP || '1d',) => {
    const secret = process.env.JWT_KEY as string;

    if (!secret) throw new Error("jwt secret missing in env");

    return jwt.sign(payload, secret, {
        expiresIn: exp
    })
}

export const stripUser = (user: User) => {
    const newUser: any = user;

    delete newUser.password;
    delete newUser.resetToken;
    delete newUser.updatedAt;
    delete newUser.resetTokenExpDate;

    return newUser;
}

export const generateRandomLinkToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


