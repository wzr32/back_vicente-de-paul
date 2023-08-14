import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { routes } from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.set("flushHeaders", true);
app.set("PORT", process.env.PORT || 3000);
app.use(express.json());

app.use("/api", routes);

export default app;
