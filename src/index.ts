import app from "./app";
import Colors from "colors";
import { AppDataSource, createInitialData } from "./database";

(async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    await createInitialData();
    console.log(Colors.green("Database connected"));
    app.listen(PORT, () => {
      console.log(Colors.green(`Server on port ${PORT}`));
    });
  } catch (error) {
    console.log(Colors.red("Initialized error"), error);
  }
})();

const PORT = app.get("PORT");
