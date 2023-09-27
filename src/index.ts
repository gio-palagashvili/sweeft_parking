import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user/index"
import vehicleRoutes from "./routes/vehicle/index"
import manageParkingRoutes from "./routes/manageParking/index"
import userParkingRoutes from "./routes/parking/index";
import nodeCronJob from "./lib/nodeCron";

const app: Express = express();

dotenv.config({ path: ".env" });

const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

nodeCronJob;


app.use("/user", userRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/admin/parking", manageParkingRoutes);
app.use("/parking", userParkingRoutes);


app.listen(port, () => {
    console.log(`App running on port : ${port}`);
});

export default app