import { Router } from "express";
import { checkUnwantedFields, handleValidationErrors } from "../../middlewares/handleValidationErrors";
import { body, param } from "express-validator";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createVehicle, deleteVehicle, updateVehicle } from "../../controllers/vehicle";

const router = Router();

router.use(authMiddleware)

router.post("/create",
    body("name").isLength({ min: 1, max: 16 }).withMessage("name lenght should be between 1 and 16"),
    body("licensePlate").notEmpty().isLength({ min: 3, max: 9 }).withMessage("invalid license plate").toLowerCase(),
    body("type").notEmpty().isLength({ min: 1, max: 16 }).withMessage("invalid type").toLowerCase(),
    handleValidationErrors,
    createVehicle
)

router.delete("/delete",
    body("licensePlate").notEmpty().isLength({ min: 3, max: 9 }).withMessage("invalid license plate").toLowerCase(),
    handleValidationErrors,
    deleteVehicle
)

router.put("/:id",
    param("id").isNumeric(),
    body("licensePlate").if(body("licensePlate").exists())
        .isLength({ min: 3, max: 9 }).withMessage("invalid license plate").toLowerCase(),
    body("type").if(body("type").exists()).isLength({ min: 1, max: 16 }).withMessage("invalid type").toLowerCase(),
    body("name").if(body("name").exists()).isLength({ min: 1, max: 16 }).withMessage("invalid type").toLowerCase(),
    checkUnwantedFields(['name', 'type', 'licensePlate']),
    handleValidationErrors,
    updateVehicle
)

export default router;