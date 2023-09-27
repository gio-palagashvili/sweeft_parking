import { Router } from "express";
import { body, param } from "express-validator";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import { getUserHistory, login, register, resetPassword, resetPasswordToken, toAdmin } from "../../controllers/user";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

// i only kept this route for ease of testing
router.post("/admin",
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("password is required")
        .isLength({ min: 6, max: 32 }).withMessage("password should be longer than 6 characters shorter than 32"),
    handleValidationErrors,
    toAdmin
)

router.post("/register",
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("password is required")
        .isLength({ min: 6, max: 32 }).withMessage("password should be longer than 6 characters shorter than 32"),
    handleValidationErrors,
    register
)

router.post("/login",
    body("email").isEmail().withMessage("Invalid credentials"),
    body("password").notEmpty().withMessage("Invalid credentials"),
    handleValidationErrors,
    login
);

router.post("/reset",
    body("email").isEmail().withMessage("Invalid email"),
    handleValidationErrors,
    resetPasswordToken
)

router.get("/history",
    handleValidationErrors,
    authMiddleware,
    getUserHistory
)

router.put("/reset/:token",
    param('token').notEmpty().withMessage("missing token"),
    body("password").notEmpty().isLength({ min: 6, max: 32 }).withMessage("password should be longer than 6 characters shorter than 32"),
    handleValidationErrors,
    resetPassword
)



export default router;