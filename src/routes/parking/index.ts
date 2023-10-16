import { Router } from "express";
import { body, param } from "express-validator";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import { endParking, startParking } from "../../controllers/parking";

const router = Router();
router.use(authMiddleware)

router.post("/start",
    body("vehicleId").exists().withMessage('vehicleId is required'),
    body("parkingZoneId").exists().withMessage('parkingZoneId is required'),
    handleValidationErrors,
    startParking
);

router.post("/end",
    body("vehicleId").exists().withMessage('vehicleId is required'),
    body("parkingZoneId").exists().withMessage('parkingZoneId is required'),
    handleValidationErrors,
    endParking
);

export default router