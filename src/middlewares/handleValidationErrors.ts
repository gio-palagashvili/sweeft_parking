import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
// import { IRequest } from "../types/main";

export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors: string[] = []
        errors.array({ onlyFirstError: true }).map(err => extractedErrors.push(err.msg));

        return res.status(400).json({
            errors: extractedErrors,
        });

    } catch (err: any) {
        throw new Error(err);
    }
};

export const checkUnwantedFields = (allowedFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Object.keys(req.body).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete req.body[key];
            }
        });
        next();
    };
};