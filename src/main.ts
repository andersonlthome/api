import express, { urlencoded, json } from "express";
import { RegisterRoutes } from "./routes/routes";

const app = express();
const port = 3000;

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);

app.listen(port, () => console.log(`Server started listening to port ${port}`));
