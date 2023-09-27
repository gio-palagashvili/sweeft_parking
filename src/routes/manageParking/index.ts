import { Router } from "express";
import { body, param } from "express-validator";
import { adminAuthMiddleware } from "../../middlewares/authMiddleware";
import { createParkingZone, deleteParkingZone, getParkingZoneHistory, getParkingZones, updateParkingZone } from "../../controllers/manageParking";
import { checkUnwantedFields, handleValidationErrors } from "../../middlewares/handleValidationErrors";

const router = Router();
router.use(adminAuthMiddleware)

router.post("/create",
    body("name").isLength({ min: 3, max: 15 }).withMessage("parking name lenght must be between 3 and 15"),
    body("address").isLength({ min: 3, max: 15 }).withMessage("address lenght must be between 3 and 15"),
    body("hourlyCost").isDecimal().withMessage("hourly cost must be a decimal"),
    handleValidationErrors,
    createParkingZone
)

router.put("/:id",
    param("id").isNumeric().withMessage("id must be numeric"),
    body("name").if(body("name").exists()).isLength({ min: 3, max: 15 }).withMessage("name lenght must be between 3 and 15"),
    body("address").if(body("address").exists()).isLength({ min: 3, max: 15 }).withMessage("address lenght must be between 3 and 15"),
    body("hourlyCost").if(body("hourlyCost").exists()).isDecimal().withMessage("hourly cost must be a decimal"),
    handleValidationErrors,
    checkUnwantedFields(['name', 'address', 'hourlyCost']),
    updateParkingZone
)

router.get("/:id/history",
    param("id").isNumeric().withMessage("id must be numeric"),
    getParkingZoneHistory,
    handleValidationErrors,
)

router.get("/zones",
    getParkingZones,
    handleValidationErrors,
)

router.delete("/:id",
    param("id").isNumeric().withMessage("id must be numeric"),
    handleValidationErrors,
    deleteParkingZone
)

export default router;