import express from "express";
import { ErrorRequestHandler } from "express";

import usersRouter from "./routes/users";
import filmRouter from "./routes/films";

let counter =1;

const app = express();


app.use((_req, _res, next) => {
  console.log("counter : ",counter);
  counter++;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/films", filmRouter);



const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    return res.status(500).send("Something broke!");
  };
  
  app.use(errorHandler);

export default app;
