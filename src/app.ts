import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { routes } from "./routes";

const app = express();

app.set("flushHeaders", true);
app.set("PORT", process.env.PORT || 3000);
app.use(express.json());

app.use("/api", routes);

export default app;
