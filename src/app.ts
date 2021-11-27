import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { itemsRouter } from "./routes/items";
import { errorHandler } from "./error-handler";
var router = express.Router();
const app = express();

app.set("trust proxy", true);
app.use(json());
router.use(itemsRouter);

app.use("/api/", router);

app.all("*", async (req) => {
  console.log(req.url);
  throw new Error("Index, /BAD_URL, route don't exist");
});

app.use(errorHandler);

export { app };
