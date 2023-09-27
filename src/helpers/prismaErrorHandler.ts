import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const prismaErrorHandler = (error: any) => {
    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2025":
                return error.meta!.cause as string
            case "P2002":
                return `record already exists (field : ${error.meta!.target as string})`
            default:
                return error.message
        }
    } else {
        return error.message
    }
}